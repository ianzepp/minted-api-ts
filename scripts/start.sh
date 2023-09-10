#!/bin/bash

if ! bun compile; then
    echo "Compilation failed!"
    exit 1
fi

# Start node
node ./dst/start.js