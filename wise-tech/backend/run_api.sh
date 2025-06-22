#!/bin/bash

# Script to run the WiseTech API server

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies if needed
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt

# Install python-jose with cryptography separately to avoid zsh issues
pip install 'python-jose[cryptography]'

# Set environment variables
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Initialize the database
echo -e "${YELLOW}Initializing database...${NC}"
python -m app.db.init_db

# Run the FastAPI server
echo -e "${GREEN}Starting API server on http://localhost:8000${NC}"
echo -e "${GREEN}Swagger UI available at http://localhost:8000/docs${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
