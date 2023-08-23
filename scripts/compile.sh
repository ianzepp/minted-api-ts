#!/bin/bash

# Delete all the compiled data
rm -rf ./dst

# Rebuild
tsc --build tsconfig.json

# # Rename javascript files to modules (assumes they are ALL modules)
# find ./dst -name '*.js' -exec sh -c 'mv "$0" "${0%.js}.mjs"' {} \;