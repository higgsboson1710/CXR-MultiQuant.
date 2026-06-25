import os
import io
import numpy as np
import tensorflow as tf
from PIL import Image
from transformers import AutoTokenizer
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Global AI Variables
model = None
tokenizer = None
MAX_LEN = 512

# Custom Focal Loss (required to load the compiled .h5 model)
@tf.keras.utils.register_keras_serializable()
class CategoricalFocalLoss(tf.keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, **kwargs):
        super().__init__(**kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_pred = tf.clip_by_value(y_pred, tf.keras.backend.epsilon(), 1.0 - tf.keras.backend.epsilon())
        cross_entropy = -y_true * tf.math.log(y_pred)
        weight = self.alpha * tf.math.pow(1.0 - y_pred, self.gamma)
        loss = weight * cross_entropy
        return tf.reduce_sum(loss, axis=-1)

    def get_config(self):
        config = super().get_config()
        config.update({"gamma": self.gamma, "alpha": self.alpha})
        return config

app = FastAPI(
    title="CXR-MultiQuant Backend API",
    description="API for the Multimodal Chest X-Ray Severity Predictor",
    version="1.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/")
def read_root():
    return {"message": "Welcome to the CXR-MultiQuant API. The server is running perfectly!"}

# --- STEP 1: LOAD AI MODELS ON STARTUP ---
@app.on_event("startup")
async def load_ai_models():
    global model, tokenizer
    print("⏳ Booting up AI Inference Engine...")
    print("1/2: Loading ClinicalBERT Tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
    
    print("2/2: Loading DenseNet Multimodal Neural Network (.h5)...")
    # Load the model with our custom loss function
    model_path = os.path.join(os.path.dirname(__file__), "best_cxr_model_final.h5")
    model = tf.keras.models.load_model(model_path, custom_objects={'CategoricalFocalLoss': CategoricalFocalLoss})
    
    print("✅ AI Models Loaded Successfully in Memory!")

# Prediction Route
@app.post("/predict")
async def predict_severity(
    image: UploadFile = File(...),
    report: str = Form(...)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # --- 1. IMAGE PREPROCESSING ---
        # Read the image, resize to 224x224, and convert to numpy array
        image_bytes = await image.read()
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img = img.resize((224, 224))
        
        # Convert to float32 and normalize [0, 1] exactly as the model was trained
        img_array = np.array(img, dtype=np.float32) / 255.0 
        img_tensor = np.expand_dims(img_array, axis=0) # Shape: (1, 224, 224, 3)

        # --- 2. NLP PREPROCESSING ---
        # Tokenize the radiologist report using ClinicalBERT
        encoded = tokenizer(
            text=report, 
            padding='max_length', 
            truncation=True, 
            max_length=MAX_LEN, 
            return_tensors='tf'
        )
        input_ids = encoded['input_ids']
        attention_mask = encoded['attention_mask']

        # --- 3. MULTIMODAL INFERENCE ---
        # Feed the Image and Text into the .h5 Model
        print("🧠 Running AI Inference...")
        preds = model.predict([img_tensor, input_ids, attention_mask])
        probs = preds[0].tolist() # Convert from numpy to standard python list

        # Find the highest probability class
        classes = ["Mild", "Moderate", "Severe"]
        max_idx = np.argmax(probs)
        final_severity = classes[max_idx]

        # --- 4. FORMAT RESPONSE FOR REACT FRONTEND ---
        response = {
            "filename": image.filename,
            "prediction": {
                "severity": final_severity,
                "probabilities": {
                    "Mild": probs[0],
                    "Moderate": probs[1],
                    "Severe": probs[2]
                }
            }
        }
        
        print(f"✅ Analysis Complete! Result: {final_severity}")
        return response

    except Exception as e:
        print(f"❌ Error during inference: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Server Start
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
