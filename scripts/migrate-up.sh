#!/bin/bash

# Compile
if ! bun compile; then
    echo "Compilation failed!"
    exit 1
fi

# Run the migration
knex migrate:up