# minted-api

## Description

This is the minted-api project. It is a Node.js project with a PostgreSQL database. The project uses knex for database migrations and jest for testing.

## Setup

1. Install the dependencies by running `bun install`.
2. Define your database connection by setting the following environment variables:
   - `POSTGRES_HOST`: The host of your PostgreSQL database.
   - `POSTGRES_DB`: The name of your PostgreSQL database.
   - `POSTGRES_USER`: The user for your PostgreSQL database.
   - `POSTGRES_PASSWORD`: The password for your PostgreSQL database.
3. Set up the database by running the migrations with `npm run migrate:latest`.

## Scripts

Here are some of the npm scripts that you can run:

- `npm run compile`: Compiles the TypeScript files.
- `npm run migrate:make`: Creates a new database migration file.
- `npm run migrate:latest`: Runs all the database migrations to the latest.
- `npm run migrate:up`: Runs the next database migration.
- `npm run migrate:down`: Undoes the last database migration.
- `npm run start`: Starts the application.
- `npm run start:dev`: Starts the application in development mode.
- `npm run test`: Compiles the project, runs the migrations, and then runs the tests.

## Testing

Tests are written using Jest. You can run the tests by running `npm run test`.

## Dependencies

Here are some of the key dependencies that the project uses:

- body: For parsing HTTP request bodies.
- chai: For assertions in tests.
- dotenv: For loading environment variables.
- fs-extra & klaw: For file system operations.
- knex: For database migrations and interacting with the PostgreSQL database.
- lodash: A utility library.
- url-parse: For parsing URLs.
- util: A utility library.
- uuid: For generating UUIDs.

## Dev Dependencies

- @types/*: TypeScript type definitions.
- jest: For running tests.
- nodemon: For automatically restarting the application during development.
- ts-jest: For using Jest with TypeScript.
- ts-node: For running TypeScript files.
- typescript: The TypeScript compiler.
- webpack-cli: A command line interface for webpack.

## License

This project is licensed under the ISC license.
