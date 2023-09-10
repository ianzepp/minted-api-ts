import { beforeAll, afterAll } from "bun:test";
import { KnexDriver } from "./classes/system-knex";

beforeAll(async () => {
    // global setup
});

afterAll(async () => {
    // global teardown
    console.warn('Tests complete: Destroying knex connection pool.');
    await KnexDriver.destroy();
});
