import { verifyToken } from "@/middleware";
import { languagesRouter } from "@/routes/languages";
import { areasOfInterestRouter } from "@/routes/areasOfInterest";
import { casesRouter } from "@/routes/cases";
import { tagsRouter } from "@/routes/tags";
import { rolesRouter } from "@/routes/roles";
import { usersRouter } from "@/routes/users";
import { volunteersRouter } from "@/routes/volunteers";
import { adminsRouter } from "@/routes/admins";
import { clinicsRouter } from "@/routes/clinics";
import { locationsRouter } from "@/routes/locations";
import { emailTemplatesRouter } from "@/routes/emailTemplates";
import { foldersRouter } from "@/routes/folders";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs

dotenv.config();

// schedule.scheduleJob("0 0 0 0 0", () => console.info("Hello Cron Job!")); // TODO: delete sample cronjob

const CLIENT_HOSTNAME =
  process.env.NODE_ENV === "development"
    ? `${process.env.DEV_CLIENT_HOSTNAME}:${process.env.DEV_CLIENT_PORT}`
    : process.env.PROD_CLIENT_HOSTNAME;

export const app = express();
app.use(
  cors({
    origin: CLIENT_HOSTNAME,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(verifyToken);
}

app.use("/users", usersRouter);
app.use("/languages", languagesRouter);
app.use("/areas-of-interest", areasOfInterestRouter);
app.use("/clinics", clinicsRouter);
app.use("/cases", casesRouter);
app.use("/volunteers", volunteersRouter);
app.use("/tags", tagsRouter);
app.use("/cases", casesRouter);
app.use("/admins", adminsRouter);
app.use("/roles", rolesRouter);
app.use("/locations", locationsRouter);
app.use("/email-templates", emailTemplatesRouter);
app.use("/folders", foldersRouter);

// Listening is moved to server.ts to enable importing app in tests
export default app;
