import sys
import os
import json
import numpy as np

# Disable TF logs - MUST BE BEFORE IMPORTING TENSORFLOW
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf
from tensorflow.keras.preprocessing import image 

def predict(image_path):
    # Locate model - assuming it's in the sibling ai-service directory
    # Adjust this path if the user moved the model
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', '..', 'ai-service', 'model', 'crack_detection_model.h5'))
    
    # Fallback to current dir if not found (in case user copied it)
    if not os.path.exists(MODEL_PATH):
        MODEL_PATH = os.path.join(BASE_DIR, 'crack_detection_model.h5')

    if not os.path.exists(MODEL_PATH):
        return {
            "error": f"Model not found at {MODEL_PATH}. Please run train_model.py in ai-service first.",
            "has_crack": False
        }

    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        
        img = image.load_img(image_path, target_size=(120, 120))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0

        prediction = model.predict(img_array, verbose=0)
        confidence = float(prediction[0][0])
        
        # Logic matches the analyzer.py
        is_crack = confidence > 0.5
        
        result = {}
        if is_crack:
            severity = "High" if confidence > 0.8 else "Medium" if confidence > 0.6 else "Low"
            result = {
                "has_crack": True,
                "confidence": f"{confidence:.2%}",
                "crack_type": "Structural Crack",
                "severity": severity,
                "remedy": "Clean the area and apply a suitable filler or sealant. Monitor for further widening.",
                "educational_info": "Cracks can occur due to thermal expansion, shrinkage, or structural settlement. Understanding the pattern helps in diagnosing the cause."
            }
        else:
            result = {
                "has_crack": False,
                "confidence": f"{(1-confidence):.2%}",
                "message": "No significant structural cracks detected in this image."
            }
            
        return result

    except Exception as e:
        return {"error": str(e), "has_crack": False}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    img_path = sys.argv[1]
    result = predict(img_path)
    print(json.dumps(result))
