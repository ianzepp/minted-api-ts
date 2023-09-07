#!/bin/bash

# Compile
if ! npm run compile; then
    echo "Compilation failed!"
    exit 1
fi

# Run the migration
knex migrate:up