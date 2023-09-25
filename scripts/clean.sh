#!/bin/bash

# Run a recompilation first
if ! bun tsc; then
    exit 1;
fi

# Postgres config
if [ "$KNEX_CLIENT" = "postgres" ]; then
    echo "Using knex config:"
    echo "- client = $KNEX_CLIENT"
    echo "- database = $KNEX_DATABASE"
    
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

# Run the migration from scratch
if ! bun autoinstall; then
    exit 1;
fi
