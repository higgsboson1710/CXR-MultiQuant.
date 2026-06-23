from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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

# Prediction Route
@app.post("/predict")
async def predict_severity(
    image: UploadFile = File(...),
    report: str = Form(...)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    dummy_response = {
        "filename": image.filename,
        "report_received": report,
        "prediction": {
            "severity": "Moderate",
            "probabilities": {
                "Mild": 0.15,
                "Moderate": 0.75,
                "Severe": 0.10
            }
        }
    }
    
    return dummy_response

# Server Start
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
