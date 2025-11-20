FROM python:3.11-slim

WORKDIR /usr/src/app

# Install build deps and runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:3000", "--workers", "1"]
