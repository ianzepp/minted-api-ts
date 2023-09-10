#!/bin/bash

if ! bun clean; then
    echo "Clean failed!"
    exit 1
fi

if ! bun compile; then
    echo "Compilation failed!"
    exit 1
fi
