#!/bin/bash

# Install the node deps
if ! npm install; then
    echo "Failed to install packages"
    exit 1
fi

# Build everything
if ! tsc --noEmit; then
    echo "Failed to compile typescript"
    exit 1
fi

# Install the database
if ! bun ./src/autoinstall.ts; then
    exit 1
fi
