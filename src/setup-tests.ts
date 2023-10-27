import { KnexDriver } from "@kernel/classes/kernel/kernel-knex";
import { beforeAll, afterAll } from "bun:test";

beforeAll(async () => {
    // global setup
});

afterAll(async () => {
    // global teardown
    await KnexDriver.destroy();
});
