import cors from "cors"; //library that lets our react app (another address) talk to this server
import dotenv from "dotenv"; //reads the .env file
import express from "express";
import type { ErrorRequestHandler } from "express";
import { sendError } from "./response.js";
import { connectDB } from "../db/index.js";
import {createAdminIfMissing } from "../db/actions.js";
import adminRoutes from "./adminRoutes.js";
import ticketsRoutes from "./ticketsRoutes.js";

dotenv.config({ quiet: true }); //quiet -> no extra message in the terminal that might expose existing secret

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL })); //only our react app is allowed to use the server
app.use(express.json()); //lets us read the body of the requests as json

//group the routes: everything in ticketsRoutes starts with /tickets, and adminRoutes with /admin
app.use("/tickets", ticketsRoutes);
app.use("/admin", adminRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  sendError(res, 400, "The request body is not a valid JSON");
};
app.use(errorHandler);


async function start(): Promise<void> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUsername || !adminPassword || !process.env.TOKEN_SECRET) {
    throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD or TOKEN_SECRET is missing in the .env file");
  }

  await connectDB(); //only when the db is connected we start the server
  await createAdminIfMissing(adminUsername, adminPassword);

  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

start().catch((err) => {
  console.log("Could not start the server: ", err);
  process.exit(1); //stop the program
});
