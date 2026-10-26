import bcrypt from "bcrypt";
import { Router } from "express";
import type { Request, Response } from "express";
import { findAdmin } from "../db/actions.js";
import { validLogin } from "../db/adminModel.js";
import { createToken } from "./auth.js";
import { sendError, sendOk } from "./response.js";

const router = Router();

// POST /admin/login -> check username + password and send back a token
//public, available for all
router.post("/login", async (req: Request, res: Response) => {
  const { error, value } = validLogin(req.body);
  if (error) {
    sendError(res, 400, error.details[0].message);
    return;
  }
  try {
    const admin = await findAdmin(value.username);
    //compare the typed password with the hashed one in the db
    const passwordIsRight = admin ? await bcrypt.compare(value.password, admin.password) : false;
    if (!admin || !passwordIsRight) {
      sendError(res, 401, "Invalid username or password"); //one general message for both a wrong username and a wrong password, so hackers do not figure out the right or wrong existing values
      return;
    }
    sendOk(res, 200, { token: createToken(admin.username) });
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Something went wrong on the server");
  }
});

export default router;
