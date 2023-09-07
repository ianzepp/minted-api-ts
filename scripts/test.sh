#!/bin/bash

# Compile everything
if ! npm run compile:clean; then
    echo "Compilation failed!"
    exit 1
fi

# Show PG vars
echo "Using NODE_ENV=$NODE_ENV"
echo "Using POSTGRES_HOST=$POSTGRES_HOST"
echo "Using POSTGRES_DB=$POSTGRES_DB"
echo "Using POSTGRES_USER=$POSTGRES_USER"

# Run the migration
knex --knexfile ./knexfile.js --client postgres migrate:latest

# Start node
jest