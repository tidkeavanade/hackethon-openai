#!/bin/bash

# Function to change port visibility
change_port_visibility() {
  local port=$1
  local visibility=$2
  gh codespace ports visibility $port:$visibility -c $CODESPACE_NAME
}

# Open a new terminal and run a command
# Run the DotNet Api
# Usage: change_port_visibility <port> <visibility>
gnome-terminal -- bash -c "cd dotnet-api && dotnet run change_port_visibility 5000 public"

 
# Run a command in the current terminal
cd angular-app && npm start