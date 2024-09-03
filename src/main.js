import { Client } from "@opensearch-project/opensearch";

export const connect = async (ctx) => {
  const { logger } = ctx;
  logger.info("Attempting to connect to OpenSearch");

  try {
    const client = new Client({
      node: ctx.env.opensearch.url,
      // Add other configuration options as needed, such as:
      // auth: {
      //   username: ctx.env.opensearch.username,
      //   password: ctx.env.opensearch.password,
      // },
      // ssl: {
      //   rejectUnauthorized: false // Use this only for self-signed certificates in development
      // }
    });

    // Test the connection
    await client.ping();
    logger.info("Successfully connected to OpenSearch");

    ctx.dbs.opensearch = {
      client,
    };
  } catch (error) {
    logger.error(`Failed to connect to OpenSearch: ${error.message}`, "error");
    throw error;
  }
};

export const disconnect = async (ctx) => {
  const { logger } = ctx;
  if (ctx.dbs?.opensearch?.client) {
    logger.info("Disconnecting from OpenSearch");
    try {
      await ctx.dbs.opensearch.client.close();
      logger.info("Successfully disconnected from OpenSearch");
    } catch (error) {
      logger.error(
        `Error during OpenSearch disconnection: ${error.message}`,
        "error"
      );
      throw error;
    }
  } else {
    logger.warn("No active OpenSearch connection to disconnect", "warn");
  }
};
