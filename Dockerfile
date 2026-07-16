# Use Python 3.12 slim image to keep it lightweight
FROM python:3.12-slim

# Set environment variables to prevent Python from writing .pyc files
# and to keep stdout unbuffered
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create and set the working directory
WORKDIR /app

# Install system dependencies required for psycopg2 and other packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install python dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the rest of the backend source code
COPY backend/ .

# Expose port 7860 for the Hugging Face Space
EXPOSE 7860

# Start Uvicorn on port 7860 (required by Hugging Face)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
