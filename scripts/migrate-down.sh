#!/bin/bash

# Compile
if ! npm run compile; then
    echo "Compilation failed!"
    exit 1
fi

# Run the migration
knex migrate:down \
    --client postgresql \
    --connection $DATABASE_URL \
    --migrations-directory=./dst/database $1
