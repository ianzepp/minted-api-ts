#!/bin/bash

# Import .env settings
source .env

# Debug
echo "Using KNEX_CLIENT: $KNEX_CLIENT"
echo "Using KNEX_HOST: $KNEX_HOST"
echo "Using KNEX_PORT: $KNEX_PORT"
echo "Using KNEX_USER: $KNEX_USER"
echo "Using KNEX_DATABASE: $KNEX_DATABASE"

# Postgres config
if [ "$KNEX_CLIENT" = "postgres" ]; then
    if [ -n "$KNEX_DATABASE" ] && ! dropdb "$KNEX_DATABASE"; then
        echo "Knex(postgres): Failed to drop database '$KNEX_DATABASE'";
        exit 1
    fi

    if [ -n "$KNEX_DATABASE" ] && ! createdb "$KNEX_DATABASE"; then
        echo "Knex(postgres): Failed to recreate database '$KNEX_DATABASE'";
        exit 1
    fi
fi

# Sqlite config
if [ "$KNEX_CLIENT" = "sqlite3" ]; then
    echo "Using knex config:"
    echo "- client = $KNEX_CLIENT"
    echo "- filename = $KNEX_FILENAME"

    if [ -n "$KNEX_FILENAME" ] && ! rm -f "$KNEX_FILENAME"; then
        echo "Knex(sqlite3): Failed to remove database file: $KNEX_FILENAME";
        exit 1
    fi
fi
