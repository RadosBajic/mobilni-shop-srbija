
#!/bin/bash

# Konfiguracija
APP_NAME="mobilisrbija"
SERVER_USER="your-server-username"
SERVER_HOST="your-server-hostname"
SERVER_PORT="22"
SERVER_PATH="/var/www/$APP_NAME"

# Boje za output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process for $APP_NAME...${NC}"

# 1. Build aplikacije
echo -e "${YELLOW}Building the application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Aborting deployment.${NC}"
    exit 1
fi
echo -e "${GREEN}Build successful!${NC}"

# 2. Kompresovanje build direktorijuma
echo -e "${YELLOW}Compressing build directory...${NC}"
tar -czf dist.tar.gz -C dist .

if [ $? -ne 0 ]; then
    echo -e "${RED}Compression failed! Aborting deployment.${NC}"
    exit 1
fi
echo -e "${GREEN}Compression successful!${NC}"

# 3. Kopiranje na server
echo -e "${YELLOW}Uploading to server...${NC}"
scp -P $SERVER_PORT dist.tar.gz $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

if [ $? -ne 0 ]; then
    echo -e "${RED}Upload failed! Aborting deployment.${NC}"
    exit 1
fi
echo -e "${GREEN}Upload successful!${NC}"

# 4. Raspakovavanje i priprema na serveru
echo -e "${YELLOW}Preparing on server...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && \
    rm -rf backup && \
    mkdir -p backup && \
    cp -r current/* backup/ || true && \
    rm -rf current && \
    mkdir -p current && \
    tar -xzf dist.tar.gz -C current && \
    rm dist.tar.gz"

if [ $? -ne 0 ]; then
    echo -e "${RED}Server preparation failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Server preparation successful!${NC}"

# 5. Čišćenje lokalnih fajlova
echo -e "${YELLOW}Cleaning up local files...${NC}"
rm dist.tar.gz
echo -e "${GREEN}Clean up complete!${NC}"

echo -e "${GREEN}Deployment completed successfully!${NC}"
