#!/bin/bash

# Run the migration
knex migrate:make --migrations-directory=./src/database $1 -x ts
