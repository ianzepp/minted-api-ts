import { KnexDriver } from "@kernel/services/kernel-knex";
import { beforeAll, afterAll } from "bun:test";

beforeAll(async () => {
    // global setup
});

afterAll(async () => {
    // global teardown
    await KnexDriver.destroy();
});
