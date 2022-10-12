#!/usr/bin/env bash

npm install

if [[ -f "src/tracker.json" ]];
then 

echo "tracker.json already available"

else
INITIAL_JSON='{"tracker":[]}'
touch src/tracker.json
echo "$INITIAL_JSON" > src/tracker.json
fi