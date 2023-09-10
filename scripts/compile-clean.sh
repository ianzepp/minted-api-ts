#!/bin/bash

# Delete all the compiled data
rm -rf ./dst

# Rebuild
bun build ./src/start.ts --outdir ./dst
