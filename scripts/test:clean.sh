#!/bin/bash

npm run clean
npm run build
npm run autoinstall
npm run test $1
