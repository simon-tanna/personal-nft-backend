import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "config";
import connectDb from "./utils/connectDb";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserialiser";
import cors from "cors";

const app = express();
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(deserializeUser);

app.use(router);

const port: number = config.get("port");

app.listen(port, () => {
  log.info(`App running on http://localhost:${port}`);
  connectDb();
});
