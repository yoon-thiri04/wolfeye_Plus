

## Start the dev environment
# Start the Docker for Database and Redis
docker-compose up --build

## Start the dev environment
# Start the FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

## Start the dev environment
# Start the React frontend
cd frontend
npm install
npm run dev