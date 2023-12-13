import env from "../env.js";
import { connect } from "mongoose";

const MONGO_URI = env.MONGO_URI;

const db = async (): Promise<void> => {
  try {
    await connect(MONGO_URI!);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection failed");
    console.error((err as Error).message);
    process.exit(1);
  }
};

export default db;
