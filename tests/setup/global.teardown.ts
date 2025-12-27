import { test as teardown } from "@playwright/test";
import { createLogger } from "../../packages/server/src/common/config/logger";

const logger = createLogger();

teardown("global teardown", async ({}) => {
  logger.info("Running global teardown ...");

  // testcontainers automatically tears down test containers
  // https://node.testcontainers.org/quickstart/usage/
});
