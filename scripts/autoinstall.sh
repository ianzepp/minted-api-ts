#!/bin/bash
npm run compile

# # Erase the existing DB
dropdb mgc-minted-api-dev
createdb mgc-minted-api-dev

# Start node
node ./dst/autoinstall.js