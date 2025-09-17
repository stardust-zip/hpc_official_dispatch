import { beforeAll, afterAll } from "vitest";
import { execSync } from "child_process";
import { prisma } from "../modules/documents/document.repository";

// This file ensures clean db for every test run

beforeAll(async () => {
  // This command points to the test database via .env.test
  // and resets it to a clean state by reapplying migrations.
  console.log("Resetting test database...");
  execSync("pnpm prisma migrate reset --force");
});

afterAll(async () => {
  await prisma.$disconnect();
});
