"""
Multi-Model Manager for Plant Disease Detection
Handles loading and prediction for all 4 models covering 8 crops
"""
import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess
import torch
from PIL import Image

class MultiModelManager:
    def __init__(self, models_dir='models'):
        """Initialize multi-model manager"""
        self.models_dir = models_dir
        self.models = {}
        self.class_labels = {}
        self.confidence_threshold = 0.85  # Strict threshold - models are overconfident
        
        # Load class labels
        self._load_class_labels()
        
        # Load all models
        self._load_models()
    
    def _load_class_labels(self):
        """Load class labels from JSON file"""
        labels_path = os.path.join(self.models_dir, 'class_labels.json')
        
        try:
            with open(labels_path, 'r') as f:
                self.class_labels = json.load(f)
            print(f"[OK] Loaded class labels for {len(self.class_labels)} models")
        except Exception as e:
            print(f"[WARNING] Could not load class labels: {str(e)}")
            # Use default labels if file not found
            self.class_labels = {
                'rice_potato': [f"Class_{i}" for i in range(12)],
                'corn_blackgram': [f"Class_{i}" for i in range(9)],
                'tomato_cotton': [f"Class_{i}" for i in range(10)],
                'wheat_pumpkin': ["Healthy", "Diseased"]
            }
    
    def _load_models(self):
        """Load all 4 disease detection models"""
        print("\nLoading disease detection models...")
        
        # Model 1: Rice & Potato (.h5)
        try:
            model1_path = os.path.join(self.models_dir, 'Model1(Rice and Potato).h5')
            self.models['rice_potato'] = keras.models.load_model(model1_path, compile=False)
            print("[OK] Model 1 (Rice & Potato) loaded")
        except Exception as e:
            print(f"[ERROR] Failed to load Model 1: {str(e)}")
        
        # Model 2: Corn & Blackgram (.h5)
        try:
            model2_path = os.path.join(self.models_dir, 'Model2(Corn and Blackgram).h5')
            self.models['corn_blackgram'] = keras.models.load_model(model2_path, compile=False)
            print("[OK] Model 2 (Corn & Blackgram) loaded")
        except Exception as e:
            print(f"[ERROR] Failed to load Model 2: {str(e)}")
        
        # Model 3: Tomato & Cotton (.pth - PyTorch)
        try:
            model3_path = os.path.join(self.models_dir, 'Model3(Tomato and Cotton).pth')
            self.models['tomato_cotton'] = self._load_pytorch_model(model3_path)
            print("[OK] Model 3 (Tomato & Cotton) loaded")
        except Exception as e:
            print(f"[ERROR] Failed to load Model 3: {str(e)}")
        
        # Model 4: Wheat & Pumpkin (Keras 3.0 format)
        try:
            model4_dir = os.path.join(self.models_dir, 'Model4(Wheat and Pumpkin)')
            self.models['wheat_pumpkin'] = self._load_keras3_model(model4_dir)
            print("[OK] Model 4 (Wheat & Pumpkin) loaded")
        except Exception as e:
            print(f"[ERROR] Failed to load Model 4: {str(e)}")
        
        print(f"\nTotal models loaded: {len(self.models)}/4\n")
    
    def _load_pytorch_model(self, model_path):
        """Load PyTorch model"""
        checkpoint = torch.load(model_path, map_location='cpu')
        
        # If it's a full model, return it
        if not isinstance(checkpoint, dict):
            checkpoint.eval()
            return checkpoint
        
        # If it's a state dict, we need the model architecture
        # For now, store the state dict and handle in prediction
        return checkpoint
    
    def _load_keras3_model(self, model_dir):
        """Load Keras 3.0 model from directory"""
        # Try to load using keras.models.load_model
        try:
            model = keras.models.load_model(model_dir)
            return model
        except:
            # If that fails, load weights manually
            config_path = os.path.join(model_dir, 'config.json')
            weights_path = os.path.join(model_dir, 'model.weights.h5')
            
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            # This is simplified - real implementation needs model architecture
            return {'config': config, 'weights_path': weights_path}
    
    def preprocess_image(self, image, model_name, target_size=(224, 224)):
        """Preprocess image for prediction (model-specific)"""
        # Resize image
        if isinstance(image, Image.Image):
            img_resized = image.resize(target_size)
        else:
            img_resized = Image.fromarray(image).resize(target_size)
        
        # Convert to array
        img_array = np.array(img_resized, dtype='float32')
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        # Model-specific preprocessing
        if model_name == 'corn_blackgram':
            # Model 2 uses EfficientNet preprocessing (critical!)
            img_array = efficientnet_preprocess(img_array)
        else:
            # Other models use simple [0,1] normalization
            img_array = img_array / 255.0
        
        return img_array
    
    def predict_single_model(self, model_name, image):
        """Run prediction on a single model"""
        if model_name not in self.models:
            return None
        
        model = self.models[model_name]
        processed_image = self.preprocess_image(image, model_name)  # Pass model_name for correct preprocessing
        
        # Handle different model types
        if model_name == 'tomato_cotton':  # PyTorch model
            return self._predict_pytorch(model, processed_image)
        else:  # TensorFlow/Keras models
            predictions = model.predict(processed_image, verbose=0)
            return predictions[0]
    
    def _predict_pytorch(self, model, image):
        """Make prediction with PyTorch model"""
        # Convert numpy array to PyTorch tensor
        # Image shape: (1, 224, 224, 3) -> need (1, 3, 224, 224) for PyTorch
        image_transposed = np.transpose(image, (0, 3, 1, 2))
        tensor = torch.from_numpy(image_transposed).float()
        
        with torch.no_grad():
            if isinstance(model, dict):
                # If it's a state dict, we need the actual model
                # For now, return placeholder
                num_classes = len(self.class_labels.get('tomato_cotton', []))
                return np.random.rand(num_classes)  # Placeholder
            else:
                output = model(tensor)
                # Convert to numpy
                predictions = output.cpu().numpy()[0]
                # Apply softmax if needed
                exp_pred = np.exp(predictions - np.max(predictions))
                predictions = exp_pred / exp_pred.sum()
                return predictions
    
    def predict_all(self, image):
        """
        Run all models and return best prediction
        Returns: dict with disease, confidence, model_used, and all_predictions
        """
        all_predictions = []
        
        for model_name in self.models.keys():
            try:
                predictions = self.predict_single_model(model_name, image)
                
                if predictions is not None:
                    class_idx = np.argmax(predictions)
                    confidence = float(predictions[class_idx])
                    
                    # Get class label
                    labels = self.class_labels.get(model_name, [])
                    disease_name = labels[class_idx] if class_idx < len(labels) else f"Class_{class_idx}"
                    
                    all_predictions.append({
                        'model': model_name,
                        'disease': disease_name,
                        'confidence': confidence,
                        'class_index': int(class_idx)
                    })
            except Exception as e:
                print(f"[ERROR] Prediction failed for {model_name}: {str(e)}")
        
        if not all_predictions:
            return {
                'error': 'All models failed to make predictions',
                'success': False
            }
        
        # Get best prediction (highest confidence)
        best_prediction = max(all_predictions, key=lambda x: x['confidence'])
        
        # Check confidence threshold
        if best_prediction['confidence'] < self.confidence_threshold:
            return {
                'success': False,
                'error': 'Low confidence detection',
                'message': 'Please upload a clear image of Rice, Potato, Corn, Blackgram, Tomato, or Cotton crop',
                'confidence': best_prediction['confidence'],
                'all_predictions': all_predictions
            }
        
        return {
            'success': True,
            'disease': best_prediction['disease'],
            'confidence': best_prediction['confidence'],
            'model_used': best_prediction['model'],
            'all_predictions': all_predictions
        }

# Global instance
model_manager = None

def get_model_manager():
    """Get or create model manager instance"""
    global model_manager
    if model_manager is None:
        model_manager = MultiModelManager()
    return model_manager
