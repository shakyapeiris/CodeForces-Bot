#!/usr/bin/env bash

npm install

INITIAL_JSON='{"tracker":[]}'
touch src/tracker.json
echo "$INITIAL_JSON" > src/tracker.json