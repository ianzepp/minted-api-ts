#!/bin/bash

# Run a recompilation first
if ! bun tsc; then
    exit 1;
fi

# Drop the DB
echo "Dropping and recreating the '$POSTGRES_DB' database.."
echo ""

if ! dropdb "$POSTGRES_DB"; then
    echo "Failed to drop database";
    exit 1
fi

if ! createdb "$POSTGRES_DB"; then
    echo "Failed to recreate database";
    exit 1
fi

# Run the migration from scratch
if ! bun autoinstall; then
    exit 1;
fi
