import { Mongoose, connect } from "mongoose";

import env from "./env.js";
import logger from "./core/logger.js";

/**
 * Connect to MongoDB
 */
async function connectMongo(): Promise<Mongoose> {
  try {
    const db = await connect(env.MONGO_URI!);
    logger.info("MongoDB connected");
    return db;
  } catch (err) {
    logger.error("MongoDB connection error");
    logger.error(err);
    process.exit(1);
  }
}

export default await connectMongo();
