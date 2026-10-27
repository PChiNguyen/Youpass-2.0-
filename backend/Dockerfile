# ==========================================
# STAGE 1: BUILDER (Installs dependencies)
# ==========================================
FROM python:3.12-slim AS builder

WORKDIR /app

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install dependencies into a temporary prefix directory to keep image clean
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ==========================================
# STAGE 2: FINAL RUNNER (Production image)
# ==========================================
FROM python:3.12-slim

WORKDIR /app

# Copy installed Python packages from the builder stage
COPY --from=builder /install /usr/local

# Copy the rest of your backend source code into the container
COPY . .

# Create a secure non-root user and assign ownership of the app directory
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose the port FastAPI runs on
EXPOSE 8000

# Start the application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]