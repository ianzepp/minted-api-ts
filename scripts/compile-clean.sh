#!/bin/bash

# Delete all the compiled data
rm -rf ./dst

# Rebuild
tsc --build tsconfig.json
