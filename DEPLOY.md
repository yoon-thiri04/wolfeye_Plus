# Deployment Guide

This guide explains how to deploy the WolfEye Plus project on a VPS (Virtual Private Server) using Docker.

## Prerequisites

1.  **VPS**: A server running Linux (Ubuntu 20.04/22.04 recommended).
2.  **Docker & Docker Compose**: Installed on the VPS.

### Install Docker on VPS (Ubuntu)

```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose Plugin
sudo apt install docker-compose-plugin -y
```

## Step 1: Transfer Files

You need to copy your project files to the VPS. You can use `scp` or `git`.

### Option A: Using Git (Recommended)

1.  Push your code to a repository (GitHub/GitLab).
2.  Clone it on your VPS:
    ```bash
    git clone <your-repo-url>
    cd wolfeye_Plus
    ```

### Option B: Using SCP (Copy from local)

Run this from your local machine:
```bash
scp -r /path/to/wolfeye_Plus user@your_vps_ip:/home/user/
```

## Step 2: Configure Production Environment

1.  Navigate to the project directory on your VPS:
    ```bash
    cd wolfeye_Plus
    ```

2.  Ensure `docker-compose.prod.yml` is present.

3.  (Optional) If you want to run on port 80 directly, edit `docker-compose.prod.yml`:
    Change:
    ```yaml
    ports:
      - 8000:8000
    ```
    To:
    ```yaml
    ports:
      - 80:8000
    ```

## Step 3: Run the Application

Run the following command to build and start the containers in production mode:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

- `-f docker-compose.prod.yml`: Specifies the production file.
- `up`: Starts the services.
- `-d`: Runs in detached mode (background).
- `--build`: Rebuilds the images to ensure latest code is used.

## Step 4: Verify Deployment

1.  Check running containers:
    ```bash
    docker compose -f docker-compose.prod.yml ps
    ```

2.  View logs if something goes wrong:
    ```bash
    docker compose -f docker-compose.prod.yml logs -f
    ```

3.  Access your application:
    Open your browser and visit `http://<your_vps_ip>:8000` (or just IP if you changed port to 80).

## Step 5: (Optional) Nginx Reverse Proxy & SSL

For a professional setup with a domain name and SSL (HTTPS), use Nginx on the host.

1.  **Install Nginx**:
    ```bash
    sudo apt install nginx -y
    ```

2.  **Create Configuration**:
    ```bash
    sudo nano /etc/nginx/sites-available/wolfeye
    ```

3.  **Add the following content** (replace `your_domain.com`):
    ```nginx
    server {
        listen 80;
        server_name your_domain.com;

        location / {
            proxy_pass http://localhost:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

4.  **Enable Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/wolfeye /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

5.  **SSL with Certbot**:
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d your_domain.com
    ```
