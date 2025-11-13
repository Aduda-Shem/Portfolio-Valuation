FROM python:3.12

WORKDIR /app/backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Make entrypoint executable
RUN chmod +x /app/backend/entrypoint.sh || true

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY . /app/backend/

# Create entrypoint script
RUN chmod +x /app/backend/entrypoint.sh || true

# Default command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

