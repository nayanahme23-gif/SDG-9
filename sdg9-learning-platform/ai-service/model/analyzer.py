import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from threading import Lock

# Global model variable
model = None
model_lock = Lock()

def get_model():
    """
    Singleton pattern to load the model only once.
    """
    global model
    if model is None:
        with model_lock:
            if model is None:
                model_path = os.path.join(os.path.dirname(__file__), 'crack_detection_model.h5')
                if os.path.exists(model_path):
                    try:
                        print(f"Loading model from {model_path}...")
                        model = tf.keras.models.load_model(model_path)
                        print("Model loaded successfully.")
                    except Exception as e:
                        print(f"Error loading model: {e}")
                else:
                    print(f"Model file not found at {model_path}. Please run train_model.py first.")
    return model

def analyze_image(image_path):
    """
    Analyzes an image to detect structural cracks using the trained model.
    
    Args:
        image_path (str): Path to the image file.
        
    Returns:
        dict: Analysis results including crack detected (bool), severity, and educational content.
    """
    loaded_model = get_model()
    
    if loaded_model is None:
        return {
            "error": "AI Model not initialized. Please ensure the model is trained and saved.",
            "has_crack": False
        }

    try:
        # Preprocess the image
        img = image.load_img(image_path, target_size=(120, 120))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) # Create a batch
        img_array /= 255.0 # Normalize

        # Predict
        prediction = loaded_model.predict(img_array)
        confidence = float(prediction[0][0])
        
        # The model is trained with: 0=Negative (No Crack), 1=Positive (Crack)
        # However, check the class indices in training. 
        # flow_from_directory assigns indices alphabetically.
        # Negative (N) comes before Positive (P)? No, N comes before P.
        # So Negative=0, Positive=1.
        # Using sigmoid, output close to 1 is Positive (Crack).
        
        is_crack = confidence > 0.5
        
        if is_crack:
            severity = "High" if confidence > 0.8 else "Medium" if confidence > 0.6 else "Low"
            return {
                "has_crack": True,
                "confidence": f"{confidence:.2%}",
                "crack_type": "Structural Crack", # Model is binary, so we generalize
                "severity": severity,
                "remedy": "Clean the area and apply a suitable filler or sealant. Monitor for further widening.",
                "educational_info": "Cracks can occur due to thermal expansion, shrinkage, or structural settlement. Understanding the pattern helps in diagnosing the cause."
            }
        else:
            return {
                "has_crack": False,
                "confidence": f"{(1-confidence):.2%}", # Confidence it's NOT a crack
                "message": "No significant structural cracks detected in this image."
            }

    except Exception as e:
        print(f"Error during analysis: {e}")
        return {
            "error": str(e),
            "has_crack": False
        }
