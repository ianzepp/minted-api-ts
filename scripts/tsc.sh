#!/bin/bash

# Build everything
if tsc --noEmit true; then
    echo "Typescript is ok."
else
    echo "Typescript errors found."
fi
