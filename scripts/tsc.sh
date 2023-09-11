#!/bin/bash

# Build everything
if ! tsc --noEmit; then
    echo "Typescript errors found."
else
    echo "Typescript is ok."
fi
