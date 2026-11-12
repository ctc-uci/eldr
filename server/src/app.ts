import { verifyToken } from "@/middleware";
import { adminsRouter } from "@/routes/admins";
import { areasOfPracticeRouter } from "@/routes/areasOfInterest";
import { casesRouter } from "@/routes/cases";
import { clinicsRouter } from "@/routes/clinics";
import { emailsRouter } from "@/routes/emails";
import { emailTemplatesRouter } from "@/routes/emailTemplates";
import { foldersRouter } from "@/routes/folders";
import { languagesRouter } from "@/routes/languages";
import { locationsRouter } from "@/routes/locations";
import { rolesRouter } from "@/routes/roles";
import { tagsRouter } from "@/routes/tags";
import { usersRouter } from "@/routes/users";
import { volunteersRouter } from "@/routes/volunteers";
import { workshopTypesRouter } from "@/routes/workshopTypes";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs

dotenv.config();

// schedule.scheduleJob("0 0 0 0 0", () => console.info("Hello Cron Job!")); // TODO: delete sample cronjob

const allowedOrigins = [
  "https://eldr.up.railway.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.PROD_CLIENT_HOSTNAME,
  process.env.DEV_CLIENT_HOSTNAME
    ? `${process.env.DEV_CLIENT_HOSTNAME}:${process.env.DEV_CLIENT_PORT || 3000}`
    : null,
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".up.railway.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
};

export const app = express();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
// if (process.env.NODE_ENV === "production") {
//   app.use(verifyToken);
// }

app.use("/users", usersRouter);
app.use("/languages", languagesRouter);
app.use("/areas-of-practice", areasOfPracticeRouter);
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
app.use("/emails", emailsRouter);
app.use("/workshop-types", workshopTypesRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

// Listening is moved to server.ts to enable importing app in tests
export default app;
