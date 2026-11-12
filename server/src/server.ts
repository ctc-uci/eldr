import dotenv from "dotenv";

dotenv.config();

import { app } from "./app";

import "../routes/scheduler.js";

const port1 = process.env.PORT ? Number(process.env.PORT) : 8080;
const port2 = process.env.PROD_SERVER_PORT
  ? Number(process.env.PROD_SERVER_PORT)
  : process.env.DEV_SERVER_PORT
  ? Number(process.env.DEV_SERVER_PORT)
  : 3001;

app.listen(port1, "0.0.0.0", () => {
  console.info(`Server listening on ${port1}`);
});

if (port2 !== port1) {
  try {
    app.listen(port2, "0.0.0.0", () => {
      console.info(`Server also listening on ${port2}`);
    });
  } catch (err) {
    console.error(`Failed to listen on secondary port ${port2}:`, err);
  }
}
