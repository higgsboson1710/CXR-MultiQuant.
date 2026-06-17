# CXR-MultiQuant — Model Architecture

This document outlines the complete multimodal deep learning architecture and data pipeline for the CXR-MultiQuant project.

## Complete Pipeline: Data Prep → Model Training → Severity Prediction

```mermaid
flowchart TB
    subgraph INPUTS["📥 INPUTS"]
        direction LR
        IMG["🩻 Chest X-Ray Image\n(224 × 224 × 3)"]
        TXT["📄 Radiology Report Text\n(Findings + Impression)"]
    end

    subgraph IMAGE_ENCODER["🟢 IMAGE ENCODER — DenseNet-121 (Pre-trained on ImageNet)"]
        direction TB
        RESIZE["Resize & Normalize\n224×224, /255.0"]
        AUG["Data Augmentation\nRandom Rotation & Zoom"]
        DENSE["DenseNet-121\n(121 Layers, include_top=False)"]
        GAP["Global Average Pooling"]
        PROJ_IMG["Dense Projection Layer\n→ 256-dim"]
        RESIZE --> AUG --> DENSE --> GAP --> PROJ_IMG
    end

    subgraph TEXT_ENCODER["🔵 TEXT ENCODER — ClinicalBERT (Pre-trained on MIMIC Notes)"]
        direction TB
        TOK["ClinicalBERT Tokenizer\nmax_length=512"]
        BERT["ClinicalBERT Transformer\n12 Layers, 768 Hidden"]
        CLS["Extract [CLS] Token\n768-dim"]
        PROJ_TXT["Dense Projection Layer\n→ 256-dim"]
        TOK --> BERT --> CLS --> PROJ_TXT
    end

    subgraph COATTN["🟣 CO-ATTENTION FUSION (Multi-Head Attention × 2)"]
        direction TB
        subgraph CROSS1["Image → Text Attention"]
            Q1["Query: Image Features"]
            KV1["Key/Value: Text Features"]
            MHA1["MultiHeadAttention\n(8 heads, key_dim=32)"]
            Q1 --> MHA1
            KV1 --> MHA1
        end
        subgraph CROSS2["Text → Image Attention"]
            Q2["Query: Text Features"]
            KV2["Key/Value: Image Features"]
            MHA2["MultiHeadAttention\n(8 heads, key_dim=32)"]
            Q2 --> MHA2
            KV2 --> MHA2
        end
        NORM1["Add & LayerNorm\n(Residual Connection)"]
        NORM2["Add & LayerNorm\n(Residual Connection)"]
        MHA1 --> NORM1
        MHA2 --> NORM2
        CONCAT["Concatenate\n→ 512-dim"]
        NORM1 --> CONCAT
        NORM2 --> CONCAT
    end

    subgraph CLASSIFIER["🟠 CLASSIFIER HEAD"]
        direction TB
        FC1["Dense(256, ReLU)"]
        BN1["BatchNormalization"]
        DROP["Dropout(0.3)"]
        FC2["Dense(128, ReLU)"]
        BN2["BatchNormalization"]
        DROP2["Dropout(0.2)"]
        OUT["Dense(3, Softmax)"]
        FC1 --> BN1 --> DROP --> FC2 --> BN2 --> DROP2 --> OUT
    end

    subgraph OUTPUT["🎯 OUTPUT & TRAINING OPTIMIZATION"]
        direction TB
        subgraph PREDS["Severity Prediction"]
            direction LR
            MILD["Mild"]
            MOD["Moderate"]
            SEV["Severe"]
        end
        LOSS["Calculate Focal Loss\n(Heavily penalizes errors on rare cases)"]
        PREDS -.->|"During Training"| LOSS
    end

    IMG --> IMAGE_ENCODER
    TXT --> TEXT_ENCODER
    PROJ_IMG --> COATTN
    PROJ_TXT --> COATTN
    CONCAT --> CLASSIFIER
    OUT --> PREDS

    %% Soft Color Styling & Highlights
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef inputStyle fill:#e8f4f8,stroke:#17a2b8,stroke-width:2px,color:#000;
    classDef imgStyle fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#000;
    classDef txtStyle fill:#cce5ff,stroke:#007bff,stroke-width:2px,color:#000;
    classDef fusionStyle fill:#e2d9f3,stroke:#6f42c1,stroke-width:3px,color:#000;
    classDef classStyle fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#000;
    classDef outputStyle fill:#f8d7da,stroke:#dc3545,stroke-width:2px,color:#000;

    class IMG,TXT inputStyle;
    class RESIZE,AUG,DENSE,GAP,PROJ_IMG imgStyle;
    class TOK,BERT,CLS,PROJ_TXT txtStyle;
    class Q1,KV1,MHA1,Q2,KV2,MHA2,NORM1,NORM2,CONCAT fusionStyle;
    class FC1,BN1,DROP,FC2,BN2,DROP2,OUT classStyle;
    class MILD,MOD,SEV,LOSS outputStyle;
```

---

## Data Pipeline (Phase 1)

```mermaid
flowchart LR
    subgraph DATASOURCE["Hugging Face Hub"]
        HF["itsanmolgupta/mimic-cxr-dataset\n30,600 rows"]
    end

    subgraph COLUMNS["Raw Columns"]
        direction TB
        C1["image: Chest X-Ray (PIL Image)"]
        C2["findings: Doctor's detailed observations"]
        C3["impression: Doctor's final conclusion"]
    end

    subgraph LABELING["Severity Label Generation"]
        direction TB
        RULE["Rule-Based NLP\nKeyword Search on Impression"]
        S1["'severe' / 'extensive' / 'massive' → Severe"]
        S2["'moderate' / 'partial' → Moderate"]
        S3["Everything else → Mild"]
        RULE --> S1
        RULE --> S2
        RULE --> S3
    end

    subgraph FINAL["Final Dataset"]
        direction TB
        F1["Image (resized 224×224)"]
        F2["Text (Findings + Impression)"]
        F3["Label: Mild / Moderate / Severe"]
    end

    HF --> COLUMNS --> LABELING --> FINAL

    %% Soft Color Styling
    classDef dataStyle fill:#e8f4f8,stroke:#17a2b8,stroke-width:2px,color:#000;
    classDef processStyle fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#000;
    classDef finalStyle fill:#e2d9f3,stroke:#6f42c1,stroke-width:2px,color:#000;

    class HF,C1,C2,C3 dataStyle;
    class RULE,S1,S2,S3 processStyle;
    class F1,F2,F3 finalStyle;
```

---

## Training Strategy

| Component | Detail |
|---|---|
| **Framework** | TensorFlow / Keras |
| **Image Encoder** | DenseNet-121 (with Random Rotation/Zoom Augmentation) |
| **Text Encoder** | ClinicalBERT (MIMIC pre-trained, fine-tuned) |
| **Fusion** | Co-Attention (2× Multi-Head Attention, 8 heads each) |
| **Pooling** | Global Average Pooling |
| **Loss Function** | Focal Loss (Addresses Class Imbalance) |
| **Train/Val/Test Split** | 80% / 10% / 10% (24,480 / 3,060 / 3,060) |
| **Evaluation Metrics** | Macro F1, AUC-ROC per class, Confusion Matrix |
| **Output** | SavedModel or .h5 file for FastAPI deployment |

---

## Hyperparameter Tuning (KerasTuner — Bayesian Optimization)

| Hyperparameter | Search Space |
|---|---|
| **Optimizer** | Adam, RMSprop |
| **Learning Rate** | 1e-3, 1e-4, 1e-5 |
| **Batch Size** | 8, 16, 32 |
| **Dropout Rate** | 0.2, 0.3, 0.5 |
| **Max Epochs per Trial** | Up to 30 (controlled by EarlyStopping) |
| **Max Trials** | 10–15 (Bayesian Optimization) |

### Callbacks (Active during every trial)

| Callback | Purpose |
|---|---|
| **EarlyStopping** | Monitors `val_loss`. Stops training if no improvement for 5 epochs. |
| **ModelCheckpoint** | Saves the best model weights from each trial automatically. |
| **ReduceLROnPlateau** | Reduces learning rate by 50% if `val_loss` plateaus for 3 epochs. |
