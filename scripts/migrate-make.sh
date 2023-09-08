#!/bin/bash

# Run the migration
knex migrate:make $1 -x ts
