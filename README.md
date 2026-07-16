---
title: CXR-MultiQuant Backend
emoji: 🫁
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---
# CXR-MultiQuant: Multimodal AI for Clinical Triage

> 🚀 **Live Demo:** [https://cxr-multi-quant.vercel.app/](https://cxr-multi-quant.vercel.app/)

CXR-MultiQuant is a **Full-Stack Multimodal Deep Learning** application designed to assist radiologists in rapidly triaging patients. 

By fusing computer vision algorithms (which scan Chest X-Rays) with Natural Language Processing algorithms (which read unstructured radiologist notes), the AI generates a unified severity prediction (Mild, Moderate, or Severe) to help prioritize critical care.

---

## 🧠 Multimodal Architecture

Unlike standard single-modality AIs, CXR-MultiQuant processes two independent data streams simultaneously:

1. **Vision Pathway (DenseNet-121):** A deep Convolutional Neural Network extracts visual spatial features (opacities, consolidations, effusions) directly from the raw pixel data of the Chest X-Ray.
2. **NLP Pathway (ClinicalBERT):** A transformer model explicitly pre-trained on the MIMIC-III database extracts rich semantic embeddings from the radiologist's free-text clinical notes.
3. **Co-Attention Fusion Layer:** The vision tensors and NLP embeddings are concatenated and passed through dense decision layers, allowing the AI to weigh clinical context alongside visual evidence before predicting the final severity score.

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Vite (Glassmorphic UI deployed on **Vercel**)
- **Backend API:** FastAPI, Uvicorn, Python (RESTful architecture)
- **Deep Learning:** TensorFlow 2, Keras, Hugging Face `transformers`
- **Deployment & DevOps:** Docker, Hugging Face Spaces (Backend CPU Hosting)
- **Training Data:** MIT MIMIC-CXR Dataset subset (7M+ trainable parameters)

---

## 🚀 How to Run Locally

If you would like to run the AI engine and frontend dashboard on your own machine:

### 1. Start the Backend (FastAPI)
```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # (On Windows: venv\Scripts\activate)

# Install dependencies
pip install -r requirements.txt

# Boot the server (Runs on port 8000)
uvicorn main:app --reload
```

### 2. Start the Frontend (React)
Open a separate terminal window:
```bash
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📸 Dashboard Preview
The frontend provides a fully responsive, HIPAA-inspired UI with mock patient queues and interactive modality uploads. 

*(You can test the live demo using the link at the top of this page!)*
