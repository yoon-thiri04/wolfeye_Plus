import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# format embedding
def format_embedding_result(result: dict) -> dict:
    embedding_clean = [round(float(x), 5) for x in result["embedding"]]
    facial_area = {
        "x": result["facial_area"]["x"],
        "y": result["facial_area"]["y"],
        "w": result["facial_area"]["w"],
        "h": result["facial_area"]["h"]
    }
    return {
        "embedding": embedding_clean,
        "facial_area": facial_area
    }
