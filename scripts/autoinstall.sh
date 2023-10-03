#!/bin/bash

# Install the database
if ! bun ./src/autoinstall.ts; then
    exit 1
fi
