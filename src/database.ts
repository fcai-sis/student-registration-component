import { Mongoose, connect } from "mongoose";

import env from "./env";
import logger from "./core/logger";

/**
 * Connect to MongoDB
 */
const connectMongo = async (mongoUri?: string): Promise<Mongoose> => {
  try {
    const db = await connect(mongoUri || env.MONGO_URI!);
    logger.info("MongoDB connected");
    return db;
  } catch (err) {
    logger.error("MongoDB connection error");
    logger.error(err);
    process.exit(1);
  }
};

export default connectMongo;
