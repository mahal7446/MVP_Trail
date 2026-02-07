import sys

# Read original file
with open('backend/model_manager.py', 'r') as f:
    lines = f.readlines()

# Find the preprocess_image function
start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if 'def preprocess_image(self' in line:
        start_idx = i
    if start_idx is not None and i > start_idx and line.strip().startswith('def '):
        end_idx = i
        break

if start_idx is None:
    print("Could not find preprocess_image function")
    sys.exit(1)

if end_idx is None:
    end_idx = len(lines)

# New function
new_function = '''    def preprocess_image(self, image, model_name, target_size=(224, 224)):
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
    
'''

# Replace the function
new_lines = lines[:start_idx] + [new_function] + lines[end_idx:]

# Write back
with open('backend/model_manager.py', 'w') as f:
    f.writelines(new_lines)

print("Successfully updated preprocess_image function")
