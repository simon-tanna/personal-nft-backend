import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import config from "config";
import connectDb from "./utils/connectDb";
import log from "./utils/logger";
import router from "./routes";

const app = express();

app.use(express.json());

app.use(router);

const port: number = config.get("port");

app.listen(port, () => {
  log.info(`App running on http://localhost:${port}`);
  connectDb();
});
