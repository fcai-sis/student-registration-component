import { connect, ConnectOptions } from "mongoose";

interface IConnectOptions extends ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

const { MONGO_URI } = process.env;

const db = async (): Promise<void> => {
  try {
    const options: IConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await connect(MONGO_URI as string, options);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection failed");
    console.error((err as Error).message);
    process.exit(1);
  }
};

export default db;
