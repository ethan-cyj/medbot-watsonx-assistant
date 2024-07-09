# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.12-slim

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install system dependencies and upgrade vulnerable packages
RUN apt-get update && \
    apt-get install -y \
    libgssapi-krb5-2 \
    libk5crypto3 \
    libkrb5-3 \
    libkrb5support0 && \
    apt-get install -y --only-upgrade \
    libgssapi-krb5-2=1.20.1-2+deb12u2 \
    libk5crypto3=1.20.1-2+deb12u2 \
    libkrb5-3=1.20.1-2+deb12u2 \
    libkrb5support0=1.20.1-2+deb12u2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install pip requirements
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app
COPY . .

# Set environment variables
ENV PORT 8080

# Expose the port
EXPOSE 8080

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD ["python", "app.py"]
