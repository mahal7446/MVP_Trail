# ML Model Integration Guide

This guide explains how to connect your `.h5` machine learning model to the application.

## Architecture

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Flask (Python) with TensorFlow/Keras
- **Model Format**: `.h5` (Keras/TensorFlow)

## Setup Instructions

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd agridetect-ai/backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Place your ML model:**
   - Create `models` directory if it doesn't exist: `mkdir models`
   - Place your `.h5` model file in `backend/models/model.h5`

5. **Configure the model (if needed):**
   - Edit `backend/app.py`:
     - Update `preprocess_image()`: Adjust image resize dimensions (default: 224x224)
     - Update `get_class_labels()`: Add your model's class labels
     - Update crop detection logic if your model detects crops

6. **Start the backend server:**
   ```bash
   python app.py
   ```
   
   The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. **Install dependencies (if not already done):**
   ```bash
   cd agridetect-ai
   npm install
   ```

2. **Configure API URL (optional):**
   - Create a `.env` file in `agridetect-ai/` directory
   - Add: `VITE_API_URL=http://localhost:5000`
   - Default is `http://localhost:5000` if not specified

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Model Requirements

Your `.h5` model should:

1. **Input Format:**
   - Accept images of size 224x224 (or update `preprocess_image()` in `app.py`)
   - RGB color format
   - Normalized pixel values (0-1 range)

2. **Output Format:**
   - Output class probabilities (softmax output)
   - Shape: `(batch_size, num_classes)`

3. **Class Labels:**
   - Update `get_class_labels()` function in `app.py` with your model's classes

## Customization

### Update Image Preprocessing

Edit `preprocess_image()` in `backend/app.py`:

```python
def preprocess_image(image_file):
    image = Image.open(io.BytesIO(image_file.read()))
    image = image.convert('RGB')
    image = image.resize((YOUR_WIDTH, YOUR_HEIGHT))  # Update size
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array
```

### Update Class Labels

Edit `get_class_labels()` in `backend/app.py`:

```python
def get_class_labels():
    return [
        "Class 1",
        "Class 2",
        "Class 3",
        # ... add all your classes
    ]
```

### Add Crop Detection

If your model detects crops, update the crop detection logic in the `/predict` endpoint.

## Testing

1. **Test backend health:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test prediction:**
   ```bash
   curl -X POST -F "image=@path/to/test/image.jpg" http://localhost:5000/predict
   ```

## Troubleshooting

### Model not loading
- Ensure `model.h5` is in `backend/models/` directory
- Check that TensorFlow/Keras versions are compatible with your model
- Verify model file is not corrupted

### CORS errors
- Flask-CORS is already configured in `app.py`
- Ensure backend is running on the correct port

### Prediction errors
- Check image preprocessing matches model requirements
- Verify class labels match model output
- Check console logs for detailed error messages

## API Endpoints

### GET `/health`
Check if server and model are ready.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### POST `/predict`
Predict disease from uploaded image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "diseaseName": "Early Blight",
  "confidence": 94.5,
  "cropName": "Tomato",
  "severity": "Medium",
  "allPredictions": [
    {"disease": "Early Blight", "confidence": 94.5},
    {"disease": "Late Blight", "confidence": 3.2},
    {"disease": "Healthy", "confidence": 2.3}
  ],
  "description": "Early Blight detected with 94.50% confidence."
}
```

## Production Deployment

For production:

1. Use a production WSGI server (e.g., Gunicorn)
2. Set up proper error handling and logging
3. Configure CORS for your frontend domain
4. Use environment variables for configuration
5. Consider using a model serving framework (TensorFlow Serving, etc.)
