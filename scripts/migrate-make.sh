#!/bin/bash

# Run the migration
knex migrate:make --migrations-directory=./src/automigrate $1 -x ts
