#!/bin/bash

# Update node ENV
export NODE_ENV="test"

# Start tests
bun test --timeout 300000 $1