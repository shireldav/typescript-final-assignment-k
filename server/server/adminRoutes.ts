import bcrypt from "bcrypt";
import { Router } from "express";
import type { Request, Response } from "express";
import { } from "../db/actions.js";
import { } from "../db/adminModel.js";
import { } from "./auth.js";
import { sendError, sendOk } from "./response.js";

const router = Router();
