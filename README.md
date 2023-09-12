# minted-api

## Description

This is the minted-api project. It is a Node.js project with a PostgreSQL database. The project uses knex for database migrations and jest for testing.

## Installing Bun

- Using curl via macOS/Linux, run in your terminal: `curl -fsSL https://bun.sh/install | bash`
- Using NPM, run in your terminal: `npm install -g bun`
- Using Homebrew, run in your terminal: 
```sh
brew tap oven-sh/bun
brew install bun
```
- Please read Bun's installation page for more information: https://bun.sh/docs/installation

## Quick Start

1. Install the project dependencies by running `bun install`.
1. Define your database connection by setting the following environment variables:
   - `POSTGRES_HOST`: The host of your PostgreSQL database.
   - `POSTGRES_DB`: The name of your PostgreSQL database.
   - `POSTGRES_USER`: The user for your PostgreSQL database.
   - `POSTGRES_PASSWORD`: The password for your PostgreSQL database.
1. Set up the database by running the migrations with `bun autoinstall`.
1. Test everything works by running `bun test`
1. Start the server with `bun start`

## Scripts

Here are some of the bun scripts that you can run:

- `bun autoinstall`: Assuming an empty DB, this installs the core PG schemas, tables and columns
- `bun clean`: Drops the DB, recreates the DB, and runs the autoinstallation again
- `bun start`: Starts the application.
- `bun test`: Runs all `*.spec.ts` files

## Testing

Tests are use Bun's framework for testing, which is akin to Jest testing. You can run these tests by running `bun test`.

## Documentation

There are `Typedoc` generated documentation files located at `docs/*`. These are formatted as markdown.

## Dependencies

Here are some of the key dependencies that the project uses:

- `body`: For parsing HTTP request bodies.
- `chai`: For assertions in tests.
- `dotenv`: For loading environment variables.
- `fs-extra` & `klaw`: For file system operations.
- `knex`: For database migrations and interacting with the PostgreSQL database.
- `lodash`: A utility library.
- `url-parse`: For parsing URLs.
- `util`: A utility library.
- `uuid`: For generating UUIDs.

## Dev Dependencies

- `@types/*`: TypeScript type definitions.
- `bun-types`: For using Bun's built-in APIs.
- `nodemon`: For automatically restarting the application during development.
- `ts-node`: For running TypeScript files.
- `typescript`: The TypeScript compiler.
- `webpack-cli`: A command line interface for webpack.

## License

This project is licensed under the ISC license.
