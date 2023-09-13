#!/bin/bash

# Use the same DB name as on github
export POSTGRES_DB=github-ci

# Drop/Create DB
dropdb "$POSTGRES_DB"
createdb "$POSTGRES_DB"

# Clean out the local node_modules
rm -rf node_modules

# Install bun
if ! npm install -g bun; then
    exit 1;
fi

# Install dependencies using Bun
if ! bun install; then
    exit 1;
fi

# Compile codebase with TSC
if ! bun tsc; then
    exit 1;
fi

# Install database schemas
if ! bun autoinstall; then
    exit 1;
fi

# Run test suite
if ! bun test --timeout 5000; then
    exit 1;
fi


