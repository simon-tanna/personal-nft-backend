import mongoose from "mongoose";
import config from "config";
import log from "./logger";

const connectDb = async () => {
  const dbUri: any = process.env.ATLAS_URI;

  try {
    await mongoose.connect(dbUri);
    log.info("Connected to Database");
  } catch (e) {
    process.exit(1);
  }
};

export default connectDb;
