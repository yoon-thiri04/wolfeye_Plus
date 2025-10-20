import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, Wifi, Sun, Bell, User } from "lucide-react";

export default function PPEDetection() {
  const webcamRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [prompt, setPrompt] = useState("Starting session...");
  const [ppeStatus, setPpeStatus] = useState({});
  const [detections, setDetections] = useState([]);
  const [missingItems, setMissingItems] = useState([]);
  const [cameraActive, setCameraActive] = useState(true);
  const [detectedPerson, setDetectedPerson] = useState(null);
  const [checkInTime, setCheckInTime] = useState("");
  const intervalRef = useRef(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const lastSpokenRef = useRef([]);
  const speechQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  // Get company authentication token
  const getCompanyAuthToken = () => {
    return localStorage.getItem('face_verification_company_token') ||
           localStorage.getItem('company_token');
  };

  const api = axios.create({
    baseURL: "http://localhost:8000",
  });

  api.interceptors.request.use(
    (config) => {
      const token = getCompanyAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const speakNext = () => {
  if (speechQueueRef.current.length === 0) {
    isSpeakingRef.current = false;
    return;
  }

  isSpeakingRef.current = true;
  const nextItem = speechQueueRef.current.shift();
  const msg = new SpeechSynthesisUtterance(`Please show your ${nextItem} clearly`);
  msg.rate = 1;

  msg.onend = () => {
    setTimeout(() => {
      speakNext();
    }, 1500);
  };

  window.speechSynthesis.speak(msg);
};


  useEffect(() => {
    const start = async () => {
      try {
        const res = await api.post("http://localhost:8000/detect/start_session", {
          person_id: email,
        });
        setSessionId(res.data.session_id);
        setPrompt("Session started. Initializing camera...");

        const now = new Date();
        setCheckInTime(
          now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      } catch (err) {
        console.error("Error starting session:", err);
        setPrompt("Failed to start session. Please try again.");
      }
    };
    start();
  }, [email]);

  const detect = async () => {
    if (!webcamRef.current || !sessionId || !cameraActive) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const res = await api.post("http://localhost:8000/detect/ppe_detect", {
        image: imageSrc,
        session_id: sessionId,
      });

      const data = res.data;

      setPrompt(data.prompt);
      setPpeStatus(data.ppe_status);
      setDetections(data.detections);
      setMissingItems(data.missing_items || []);

      if (data.person_info) setDetectedPerson(data.person_info);

      const missing = data.missing_items || [];
      missing.forEach((item) => {
        if (!lastSpokenRef.current.includes(item)) {
          speechQueueRef.current.push(item);
          lastSpokenRef.current.push(item);
        }
      });

      // Remove items that are no longer missing
      lastSpokenRef.current = lastSpokenRef.current.filter((item) => missing.includes(item));

      if (!isSpeakingRef.current && speechQueueRef.current.length > 0) {
        speakNext();
      }

      // Finalize PPE detection
      if (data.finalize) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setCameraActive(false);

        const missingCount = (data.missing_items || []).length;
        const remainingEmployees = data.remaining_employees;

        console.log("Finalizing PPE Detection:", {
          missingCount,
          remainingEmployees,
          missingItems: data.missing_items,
          finalize: data.finalize
        });

        // PPE not complete when miss 3 or above 3 items
        if (missingCount >= 3) {
          const warningMsg = new SpeechSynthesisUtterance(
            "Your PPE detection is not complete. Please wear missing items properly and make redetection."
          );
          warningMsg.rate = 1;

          warningMsg.onend = () => {
            console.log("PPE incomplete - navigating. Remaining employees:", remainingEmployees);
            // If no employees remaining, go to homepage
            if (remainingEmployees <= 0) {
              console.log("No employees remaining, going to homepage");
              navigate("/facewebcam");
            }
            else {
              console.log("Employees remaining, going to facewebcam");
              navigate("/facewebcam");
            }
          };
          window.speechSynthesis.speak(warningMsg);
        }
        // PPE complete when less than 3 missing items
        else {
          const completeMsg = new SpeechSynthesisUtterance("PPE detection complete");
          completeMsg.rate = 1;

          completeMsg.onend = () => {
            const ppeItems = data.ppe_status || {};
            const totalItems = Object.keys(ppeItems).length;
            const wornItems = Object.values(ppeItems).filter(Boolean).length;
            const points = wornItems * (100 / totalItems);

            const employeeData = {
                name: data.person_info?.name || email,
                status: "Attend",
                checkIn: checkInTime,
                earn: data.points || 0,
                ppeItems: ppeItems,
            };

            console.log("PPE complete - going to summary. Remaining employees:", remainingEmployees);
            navigate("/summary", {
              state: {
                employeeData,
                remainingEmployees
              }
            });

          };

          window.speechSynthesis.speak(completeMsg);
        }
      }
    } catch (err) {
      console.error("Detection error:", err);
      setPrompt("Error during detection.");
    }
  };

  useEffect(() => {
    if (!sessionId || !cameraActive) return;
    intervalRef.current = setInterval(detect, 4000);
    return () => clearInterval(intervalRef.current);
  }, [sessionId, cameraActive]);

  const renderBoxes = () => {
    if (!webcamRef.current?.video) return null;
    return detections.map((det, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          border: "2px solid #00FF88",
          top: det.bbox[1],
          left: det.bbox[0],
          width: det.bbox[2] - det.bbox[0],
          height: det.bbox[3] - det.bbox[1],
          color: "#00FF88",
          fontWeight: "bold",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "#00FF88",
            color: "#000",
            fontSize: "12px",
            padding: "1px 3px",
            borderRadius: "2px",
          }}
        >
          {det.class} ({(det.confidence * 100).toFixed(1)}%)
        </span>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-left">
            Real Time Safety Detection (PPE)
          </h1>
          <p className="text-gray-600 text-sm mt-2 text-left">
            Your safety is your strength. WolfEye+ ensures every worker starts the day
            prepared and protected
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Camera Feed</h2>
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-green-500" />
                  <Sun className="w-5 h-5 text-green-500" />
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                </div>

                <div className="aspect-[4/3] flex items-center justify-center relative">
                  {cameraActive ? (
                    <>
                      <Webcam
                        ref={webcamRef}
                        mirrored={true}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                      />
                      {renderBoxes()}
                      {detections.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-green-700">
                          {/*<div className="w-24 h-24 border-4 border-green-400 rounded-full animate-pulse mb-4"></div>*/}
                          {/*<p className="text-lg font-medium">Camera Active</p>*/}
                          {/*<p className="text-sm text-green-600">Scanning for faces...</p>*/}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <p className="text-lg font-medium">Camera Stopped</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => setCameraActive(true)}
                  disabled={cameraActive}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4" />
                  Start Camera
                </button>

                <button
                  onClick={() => setCameraActive(false)}
                  disabled={!cameraActive}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4" />
                  Stop Camera
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-left">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Alert</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>

              {missingItems.length > 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <User className="w-5 h-5 text-yellow-700" />
                    </div>
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium mb-1">
                        You missed wearing safety <span className="font-bold">{missingItems[0]}</span>!
                      </p>
                      <p className="text-yellow-700">
                        Please wear them properly and face the camera clearly for re-detection.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <User className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="text-sm text-green-800">
                      <p className="font-medium">All safety equipment detected</p>
                      <p className="text-green-700 mt-1">Ready for site access</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Status</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <span className="text-sm font-medium text-gray-900">PPE Recognition</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    cameraActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {cameraActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Check In:</span>
                  <span className="text-sm font-medium text-gray-900">{checkInTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Detected Person</h3>
              </div>

              {detectedPerson || email ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex flex-col items-start justify-center space-y-1">
                  {/* Name */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <p className="font-semibold text-gray-900">
                      {detectedPerson?.name || email || "Worker"}
                    </p>
                  </div>

                  {/* Role */}
                  <p className="text-xs text-gray-600 ml-4">
                    Role: {detectedPerson?.role || "Employee"}
                  </p>

                  {/* Time */}
                  <p className="text-xs text-gray-500 ml-4">
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    No person detected yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}