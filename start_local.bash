#!/bin/bash

# Check if tmux is installed
if ! command -v tmux &> /dev/null
then
    echo "tmux could not be found. Please install it."
    exit
fi

# Start a new tmux session or attach to an existing one
tmux new-session -d -s timezone_dev

# Create a window for the frontend
tmux new-window -t timezone_dev:1 -n frontend
tmux send-keys -t timezone_dev:1 "cd /frontend" C-m
tmux send-keys -t timezone_dev:1 "npm install" C-m
tmux send-keys -t timezone_dev:1 "npm run dev" C-m

# Create a window for the backend
tmux new-window -t timezone_dev:2 -n backend
tmux send-keys -t timezone_dev:2 "cd /home/aiden/Projects/web/Timezone/backend" C-m
tmux send-keys -t timezone_dev:2 "dotnet run --project TimezoneConverter.Api" C-m

tmux attach-session -t timezone_dev
