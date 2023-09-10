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

## Setup Bun For TypeScript

Bun requires additional steps in order to configure it for use with TypeScript. The steps are taken from Bun's installation page. Please refer to the aforementioned website for more information.

1. Install TypeScript definitions for Bun's built-in APIs: `bun add -d bun-types # dev dependency`
2. Include `"bun-types"` in the `compilerOptions.types` of your `tsconfig.json`:
```json
{
  "compilerOptions": {
     "types": ["bun-types"]
  }
}
```
3. To use the recommended `compilerOptions` (via https://bun.sh/docs/runtime/typescript) alongside necessary ones:
```json
{
  "compilerOptions": {
     // required for minted-api
     "outDir": "dst",
     "sourceMap": true,

     // add Bun type definitions
     "types": ["bun-types"],
 
     // enable latest features
     "lib": ["esnext"],
     "module": "esnext",
     "target": "esnext",
 
     // if TS 5.x+
     "moduleResolution": "bundler",
     "noEmit": true,
     "allowImportingTsExtensions": true,
     "moduleDetection": "force",
 
     // other 
     "allowJs": true, // allow importing `.js` from `.ts`
     "esModuleInterop": true, // allow default imports for CommonJS modules
 
     // best practices
     "strict": true,
     "forceConsistentCasingInFileNames": true,
     "skipLibCheck": true
  }
}
```

## Setup

1. Install the dependencies by running `bun install`.
3. Define your database connection by setting the following environment variables:
   - `POSTGRES_HOST`: The host of your PostgreSQL database.
   - `POSTGRES_DB`: The name of your PostgreSQL database.
   - `POSTGRES_USER`: The user for your PostgreSQL database.
   - `POSTGRES_PASSWORD`: The password for your PostgreSQL database.
4. Set up the database by running the migrations with `bun migrate:latest`.

## Scripts

Here are some of the bun scripts that you can run:

- `bun clean`: Deletes any compiled files in the `dst` directory.
- `bun compile`: Compiles the TypeScript files.
- `bun compile:clean`: Executes the steps in `bun clean` and then in `bun compile`.
- `bun migrate:make`: Creates a new database migration file.
- `bun migrate:latest`: Runs all the database migrations to the latest.
- `bun migrate:up`: Runs the next database migration.
- `bun migrate:down`: Undoes the last database migration.
- `bun start`: Starts the application.
- `bun start:dev`: Starts the application in development mode.
- `bun test`: Compiles the project, runs the migrations, and then runs the tests.

## Testing

Tests are use Bun's framework for testing, which is akin to Jest testing. You can run these tests by running `bun test`.

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
