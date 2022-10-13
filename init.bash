#!/usr/bin/env bash

npm install
echo -e "\n"

if [[ -f "src/tracker.json" ]];
then 
    echo "tracker.json already created"
    echo -e "\n"
else
    INITIAL_JSON='{"tracker":[]}'
    touch src/tracker.json
    echo "$INITIAL_JSON" > src/tracker.json
fi

if [[ -f ".env" ]];
then
    echo ".env file is already created"
else 
    read -sp "Enter bots token: " TOKEN
    echo -e "\n"
    read -p "Enter a channel ID: " CHANNEL_ID
    echo "DISCORD_BOT_TOKEN=$TOKEN" > ".env"
    echo "CHANNEL_ID=$CHANNEL_ID"  >> ".env"
fi