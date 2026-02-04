import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def preload():
    logger.info("Starting model preload...")
    
    # 1. Preload DeepFace VGG-Face model
    try:
        from deepface import DeepFace
        logger.info("Downloading/Loading DeepFace VGG-Face model...")
        # build_model triggers the download if weights are missing
        DeepFace.build_model("VGG-Face")
        logger.info("DeepFace VGG-Face model loaded successfully.")
    except Exception as e:
        logger.error(f"Error loading DeepFace model: {e}")
        raise e

    logger.info("Preload complete.")

if __name__ == "__main__":
    preload()
