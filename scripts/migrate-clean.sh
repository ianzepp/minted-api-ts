#!/bin/bash

# Compile
if ! bun compile:clean; then
    echo "Compilation (clean) failed!"
    exit 1
fi

# Delete the database
if ! dropdb -e $POSTGRES_DB; then
    echo "Failed to drop database '$POSTGRES_DB'!"
    exit 1
else
    echo "Dropped database '$POSTGRES_DB'"
    echo
fi

# Recreate the DB
if ! createdb -e $POSTGRES_DB; then
    echo "Failed to recreate database '$POSTGRES_DB'!"
    exit 1
else
    echo "Recreated database '$POSTGRES_DB'"
    echo
fi

# Run the migration from scratch
knex migrate:latest
