FROM node:18-slim

# Install Python and pip
RUN apt-get update || : && apt-get install -y python3 python3-pip python3-venv

# Create app directory
WORKDIR /usr/src/app

# Copy server package files
COPY server/package*.json ./server/

# Install server dependencies
WORKDIR /usr/src/app/server
RUN npm install

# Build Python environment
WORKDIR /usr/src/app/ai-service
COPY ai-service/requirements.txt ./
# Using --break-system-packages because we are in a container, or use venv
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# Copy all source code
WORKDIR /usr/src/app
COPY . .

# Expose port
EXPOSE 5000

# Start server
WORKDIR /usr/src/app/server
CMD [ "npm", "start" ]
