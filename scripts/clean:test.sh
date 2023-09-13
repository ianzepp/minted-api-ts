#!/bin/bash

# Run a reinstallation first
if ! bun clean; then
    exit 1;
fi

# Run tests
if ! bun test; then
    exit 1;
fi
