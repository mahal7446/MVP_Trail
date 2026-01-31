"""
Flask backend server for plant disease detection using ML model (.h5)
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow import keras
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global variable to store the loaded model
model = None

def load_model():
    """Load the .h5 model file"""
    global model
    # Try to find the model file (supports multiple possible names)
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    possible_names = [
        'efficientnet_b3_final (1).h5',  # Your actual model filename
        'model.h5',  # Standard name
        'efficientnet_b3_final.h5',
    ]
    
    model_path = None
    for name in possible_names:
        path = os.path.join(models_dir, name)
        if os.path.exists(path):
            model_path = path
            break
    
    if model_path is None:
        raise FileNotFoundError(
            f"Model file not found in {models_dir}. "
            f"Please place your .h5 model file in backend/models/ "
            f"(looking for: {', '.join(possible_names)})"
        )
    
    try:
        model = keras.models.load_model(model_path)
        print(f"Model loaded successfully from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise

def preprocess_image(image_file):
    """
    Preprocess image for model prediction
    Your EfficientNet-B3 model has built-in preprocessing layers (Rescaling, Normalization),
    so we pass raw pixel values (0-255) instead of normalized values.
    """
    # Read image from file
    image = Image.open(io.BytesIO(image_file.read()))
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize image to match model input size (224x224)
    image = image.resize((224, 224), Image.Resampling.LANCZOS)
    
    # Convert to numpy array - keep raw pixel values (0-255) since model has built-in preprocessing
    img_array = np.array(image, dtype=np.float32)
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def get_class_labels():
    """
    Return class labels for predictions
    Your model has 9 classes - UPDATE THESE with your actual class names
    IMPORTANT: The order must match your model's training labels exactly!
    """
    # TODO: Replace these with your actual 9 class names in the correct order
    return [
        "Blackgram_LeafCrinckle",
        "Blackgram_YellowMosaic",
        "Blackgram_Healthy",
        "Blackgram_Anthracnose",
        "Blackgram_PowderyMildew",
        "Corn_CommonRust",
        "Corn_Blight",
        "Corn_Healthy",
        "Corn_GrayLeafSpot",
    ]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict plant disease from uploaded image"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                "error": "Model not loaded. Please ensure model.h5 is in backend/models/"
            }), 500
        
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({"error": "No image file selected"}), 400
        
        # Preprocess image
        processed_image = preprocess_image(image_file)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        
        # Get class labels
        class_labels = get_class_labels()
        
        # Debug: Print raw predictions (for troubleshooting)
        print(f"\n{'='*60}")
        print(f"PREDICTION DEBUG INFO")
        print(f"{'='*60}")
        print(f"Raw predictions: {predictions[0]}")
        print(f"Prediction sum: {np.sum(predictions[0]):.4f}")  # Should be ~1.0 if softmax
        print(f"\nAll class confidences:")
        for i, label in enumerate(class_labels):
            print(f"  [{i}] {label}: {predictions[0][i]*100:.2f}%")
        
        # Get top prediction
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx] * 100)
        predicted_class = class_labels[predicted_class_idx] if predicted_class_idx < len(class_labels) else f"Class {predicted_class_idx}"
        
        # Get top 3 predictions with indices for debugging
        top_indices = np.argsort(predictions[0])[-3:][::-1]
        top_predictions = [
            {
                "disease": class_labels[idx] if idx < len(class_labels) else f"Class {idx}",
                "confidence": float(predictions[0][idx] * 100),
                "index": int(idx)  # Add index for debugging
            }
            for idx in top_indices
        ]
        
        print(f"Top prediction: Index {predicted_class_idx} = {predicted_class} ({confidence:.2f}%)")
        
        # Determine severity based on confidence
        if confidence >= 80:
            severity = "High"
        elif confidence >= 60:
            severity = "Medium"
        else:
            severity = "Low"
        
        # Extract crop name from predicted class (e.g., "Blackgram_Anthracnose" -> "Blackgram")
        crop_name = predicted_class.split('_')[0] if '_' in predicted_class else "Unknown"
        
        return jsonify({
            "success": True,
            "diseaseName": predicted_class,
            "confidence": round(confidence, 2),
            "cropName": crop_name,
            "severity": severity,
            "allPredictions": top_predictions,
            "description": f"{predicted_class} detected with {confidence:.2f}% confidence."
        })
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({
            "error": f"Prediction failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Load model on startup
    try:
        load_model()
    except Exception as e:
        print(f"Warning: Could not load model: {str(e)}")
        print("Server will start but predictions will fail until model is available.")
    
    # Run Flask server
    app.run(host='0.0.0.0', port=5000, debug=True)
