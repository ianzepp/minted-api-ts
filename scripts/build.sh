#!/bin/bash

if ! tsc --noEmit; then
    echo "Failed to compile typescript"
    exit 1
fi

