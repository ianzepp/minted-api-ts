#!/bin/bash

if ! tsc; then
    echo "Failed to compile typescript"
    exit 1
fi

