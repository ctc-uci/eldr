import dotenv from "dotenv";

dotenv.config();

import { app } from "./app";

import "../routes/scheduler.js";

const SERVER_PORT = Number(
  process.env.PORT ||
    (process.env.NODE_ENV === "development"
      ? process.env.DEV_SERVER_PORT
      : process.env.PROD_SERVER_PORT) ||
    3001
);

app.listen(SERVER_PORT, "0.0.0.0", () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});
