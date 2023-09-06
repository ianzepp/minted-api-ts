#!/bin/bash
if ! npm run compile; then
    echo "Compilation failed!"
    exit 1
fi

# Start node
node ./dst/start.js