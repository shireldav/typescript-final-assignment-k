import cors from "cors"; // library that lets our React app (another address) talk to this server
import dotenv from "dotenv"; // reads the .env file
import express from "express";
import type { ErrorRequestHandler } from "express";
import { sendError } from "./response.js";
import { connectDB } from "../db/index.js";
import { } from "../db/actions.js";
import { } from "./adminRoutes.js";
import { } from "./ticketsRoutes.js";
