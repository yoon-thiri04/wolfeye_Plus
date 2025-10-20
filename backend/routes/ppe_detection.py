from fastapi import APIRouter, Depends
import base64, io, json, time, uuid, redis
from backend.utils.dependencies import company_required
from ultralytics import YOLO
from PIL import Image
from backend.models.employee import Attendance
from backend.crud.employee import marked_attended
from backend.models.detect import DetectRequest, StartSessionRequest
from backend.crud.ppe_detect import save_ppe_record

PPE_CLASSES = ["helmet", "gloves", "vest", "goggles", "ear protection", "person"]
detect_router = APIRouter(prefix="/detect")

model = YOLO("backend/routes/best.pt")
r = redis.Redis(decode_responses=True)

STABLE_THRESHOLD = {"helmet": 1, "gloves": 1, "vest": 1, "goggles": 1, "ear protection": 1, "person": 1}
MAX_ROUNDS = 6
NO_PERSON_LIMIT = 3
EARLY_MISSING_CHECK_ROUNDS = 4


@detect_router.post("/start_session")
def start_session(req: StartSessionRequest):
    session_id = str(uuid.uuid4())
    session = {
        "person_id": req.person_id,
        "rounds": 0,
        "detections_count": {cls: 0 for cls in PPE_CLASSES},
        "ppe_status": {cls: False for cls in PPE_CLASSES},
        "no_person_count": 0,
        "last_seen_time": time.time(),
    }
    print(session)
    print("Hi")
    r.set(f"session:{session_id}", json.dumps(session), ex=60 * 5)
    return {"session_id": session_id, "message": "Session started successfully."}


@detect_router.post("/ppe_detect")
async def detect(req: DetectRequest, current_user: dict = Depends(company_required)):
    key = f"session:{req.session_id}"
    data = r.get(key)
    if not data:
        return {"error": "Session expired or invalid."}
    session = json.loads(data)

    # Decode image
    try:
        img_data = base64.b64decode(req.image.split(",")[1])
    except Exception:
        return {"error": "Invalid image format."}
    image = Image.open(io.BytesIO(img_data))

    # Run detection
    results = model(image, conf=0.25)
    boxes = results[0].boxes
    detected_classes = {model.names[int(b.cls)] for b in boxes}

    finalize = False
    # Count detections
    for cls in detected_classes:
        if cls in session["detections_count"]:
            session["detections_count"][cls] += 1

    session["rounds"] += 1

    # Mark stable items
    for cls in PPE_CLASSES:
        if session["detections_count"][cls] >= STABLE_THRESHOLD[cls]:
            session["ppe_status"][cls] = True

    missing = [k for k, v in session["ppe_status"].items() if not v and k != "person"]

    finalize = False
    prompt = ""
    points_today = 0  # Initialize points

    # All items stable → stop immediately
    if all(session["ppe_status"].values()):
        finalize = True
        prompt = "✅ All PPE detected successfully!"

    # Early missing check → after few rounds, stop if person stable but PPE missing
    elif (
            session["rounds"] >= EARLY_MISSING_CHECK_ROUNDS
            and session["ppe_status"]["person"]
            and missing
    ):
        finalize = True
        prompt = f"⚠️ Missing items: {', '.join(missing)}"

    #  Max rounds reached → finalize
    elif session["rounds"] >= MAX_ROUNDS:
        finalize = True
        prompt = (
            "✅ All PPE detected successfully!"
            if not missing
            else f"⚠️ Missing items: {', '.join(missing)}"
        )
    if finalize:
        total_ppe = ["helmet", "vest", "gloves", "goggles", "ear_protection"]
        detected_count = sum(1 for k in total_ppe if session["ppe_status"].get(k))
        points_today = detected_count * 20
        missing_count = len(total_ppe) - detected_count
        compliance_status = "non"
        if missing_count == 0:
            compliance_status = "fully"
        elif 1 <= missing_count <= 2:
            compliance_status = "partially"
        else:
            compliance_status = "non"
        result = await save_ppe_record(session["person_id"], current_user["id"], session["ppe_status"], points_today,
                                       compliance_status)
        emp = Attendance(
            employee_email=session["person_id"],
            company_id=current_user["id"],
            present=True)
        print(emp)
        result_att = await marked_attended(emp)
        if result_att:
            print("Sucess Inserting")
        else:
            print("Error Inserting")
        if result:
            print(f"[DB] PPE record saved for {session['person_id']} ({points_today} pts)")
        else:
            print("[DB] Error saving PPE record.")

        r.delete(key)
    else:
        # Continue detection session
        prompt = f"Please show your {missing[0]} clearly." if missing else "Hold still, verifying detection stability..."
        r.set(key, json.dumps(session), ex=60 * 5)

    return {
        "prompt": prompt,
        "ppe_status": session["ppe_status"],
        "missing_items": missing,
        "rounds": session["rounds"],
        "detections": [
            {
                "class": model.names[int(b.cls)],
                "confidence": float(b.conf),
                "bbox": b.xyxy[0].tolist(),
            }
            for b in boxes
        ],
        "finalize": finalize,
        "points": points_today,  # Add points to response
        "person_info": session.get("person_info", {})  # Include person info if available
    }