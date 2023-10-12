#!/bin/bash

npm run build
npm run autoinstall
npm run test $1
