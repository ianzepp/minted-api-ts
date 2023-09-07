#!/bin/bash

# Compile everything
if ! npm run compile:clean; then
    echo "Compilation failed!"
    exit 1
fi

# Show PG vars
# echo "Using NODE_ENV=$NODE_ENV"
# echo "Using POSTGRES_HOST=$POSTGRES_HOST"
# echo "Using POSTGRES_DB=$POSTGRES_DB"
# echo "Using POSTGRES_USER=$POSTGRES_USER"

# Run the migration
npm install knex -g
knex --knexfile ./knexfile.js --client postgresql migrate:latest

# Start node
jest