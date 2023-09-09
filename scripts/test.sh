#!/bin/bash

# Show PG vars
echo "Using NODE_ENV=$NODE_ENV"
echo "Using POSTGRES_HOST=$POSTGRES_HOST"
echo "Using POSTGRES_DB=$POSTGRES_DB"
echo "Using POSTGRES_USER=$POSTGRES_USER"

# Compile everything
if ! npm run compile; then
    echo "Compilation failed!"
    exit 1
fi

# Force test mode
NODE_ENV="test"

# Start node
jest "$@"