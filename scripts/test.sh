#!/bin/bash

# Show PG vars
echo "Using NODE_ENV=$NODE_ENV"
echo "Using POSTGRES_HOST=$POSTGRES_HOST"
echo "Using POSTGRES_DB=$POSTGRES_DB"
echo "Using POSTGRES_USER=$POSTGRES_USER"

# Compile everything
if ! npm run compile:clean; then
    echo "Compilation failed!"
    exit 1
fi

# Run the migration
knex migrate:latest

# Start node
jest