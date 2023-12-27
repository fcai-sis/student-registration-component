import database from "./database.js";
import logger from "./core/logger.js";
import env, { validateEnvironmentVariables } from "./env.js";
import app from "./app.js";

// Ensure that all required environment variables are present
validateEnvironmentVariables();

// Connect to MongoDB
await database();

// Start Express server
app.listen(env.PORT, () => {
  logger.info(`Server is listening on port ${env.PORT}`);
});
