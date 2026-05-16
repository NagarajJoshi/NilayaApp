# NilayaApp

# 1. Access the main project directory
cd scholarship-app

# 2. Spin up all containers in detached mode and trigger building images
docker-compose up --build -d

# 3. Monitor container boot logs to verify database connectivity
docker-compose logs -f backend
