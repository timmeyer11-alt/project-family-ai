#!/bin/bash
# Serve the Project Family AI website and create a public tunnel
cd /Users/tim.meyer/Projects/project-family-ai/website
pkill -f "python3 -m http.server 8787" 2>/dev/null
pkill -f "ssh.*localhost.run" 2>/dev/null
sleep 1
echo "Starting local server..."
python3 -m http.server 8787 &
sleep 1
echo "Creating public tunnel..."
echo "Look for your URL below (ends in .lhr.life)"
echo "Share that URL with your friends!"
echo "Press Ctrl+C to stop."
echo ""
ssh -o StrictHostKeyChecking=no -R 80:localhost:8787 nokey@localhost.run
