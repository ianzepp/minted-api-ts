#!/bin/bash

# Update node ENV
export NODE_ENV="test"

# Start tests
bun test --timeout 60000 $1