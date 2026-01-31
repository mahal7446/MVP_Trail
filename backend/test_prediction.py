"""
Simple script to test the prediction API endpoint
Usage: python test_prediction.py <path_to_image>
"""
import sys
import requests
import json

def test_prediction(image_path):
    """Test the prediction endpoint with an image file"""
    url = "http://localhost:5000/predict"
    
    try:
        # Open and send the image file
        with open(image_path, 'rb') as image_file:
            files = {'image': image_file}
            print(f"Testing prediction with: {image_path}")
            print(f"Sending request to: {url}")
            print("-" * 60)
            
            response = requests.post(url, files=files)
            
            if response.status_code == 200:
                result = response.json()
                print("\n[SUCCESS]")
                print("=" * 60)
                print(f"Crop: {result.get('cropName', 'Unknown')}")
                print(f"Disease: {result.get('diseaseName', 'Unknown')}")
                print(f"Confidence: {result.get('confidence', 0):.2f}%")
                print(f"Severity: {result.get('severity', 'Unknown')}")
                print("\nTop 3 Predictions:")
                for i, pred in enumerate(result.get('allPredictions', []), 1):
                    print(f"  {i}. {pred.get('disease', 'Unknown')}: {pred.get('confidence', 0):.2f}% (Index: {pred.get('index', '?')})")
                print("=" * 60)
            else:
                print(f"\n[ERROR] Status code {response.status_code}")
                print(response.text)
                
    except FileNotFoundError:
        print(f"[ERROR] Image file not found: {image_path}")
    except requests.exceptions.ConnectionError:
        print("[ERROR] Could not connect to backend server.")
        print("   Make sure the backend is running: python app.py")
    except Exception as e:
        print(f"[ERROR] {str(e)}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python test_prediction.py <path_to_image>")
        print("\nExample:")
        print("  python test_prediction.py test_image.jpg")
        print("  python test_prediction.py C:/path/to/image.png")
        sys.exit(1)
    
    image_path = sys.argv[1]
    test_prediction(image_path)
