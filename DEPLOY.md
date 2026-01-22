# Server Deployment Guide

This guide explains how to manually deploy the WolfEye Plus project on your VPS from the `staging` branch.

## Prerequisites

1.  **VPS**: A server running Linux (Ubuntu 20.04/22.04 recommended).
2.  **Docker & Docker Compose**: Installed on the VPS.

### 1. Install Docker (if not already installed)

Run these commands on your server:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose Plugin
sudo apt install docker-compose-plugin -y
```

---

## Step-by-Step Deployment

### 1. Clone the Repository
Clone the project and switch to the `staging` branch.

```bash
# Clone the repository
git clone <your-repo-url>
cd wolfeye_Plus

# Checkout the staging branch
git fetch origin staging
git checkout staging
```

### 2. (Optional) Configure Environment
The `docker-compose.prod.yml` file already contains default configuration for the database and backend.
If you need to customize ports or secrets, you can edit the file:

```bash
nano docker-compose.prod.yml
```
*   Default Port: `8090` (Mapped to internal `8000`)

### 3. Start the Application
Run the following command to build and start the containers.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 4. Verify Deployment
Check if the containers are running and healthy.

```bash
docker compose -f docker-compose.prod.yml ps
```

You can also view the logs:
```bash
docker compose -f docker-compose.prod.yml logs -f
```

### 5. Access the Application
Open your browser and navigate to:
`http://<YOUR_VPS_IP>:8090`

*   **Frontend**: `http://<YOUR_VPS_IP>:8090`
*   **API Docs**: `http://<YOUR_VPS_IP>:8090/docs`

---

## Updating the Deployment
To update the server with the latest code from `staging`:

```bash
cd wolfeye_Plus
git fetch origin staging
git reset --hard origin/staging
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans
docker image prune -f
```
