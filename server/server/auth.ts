import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "./response.js";

function getSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error("TOKEN_SECRET is missing in the .env file");
  }
  return secret;
}

//create the token after successful login (the content is: username + role)
export function createToken(username: string): string {
  return jwt.sign({ username, role: "admin" }, getSecret(), { expiresIn: "8h" });
}

//middleware func, we put it before every admin route.
export function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.header("x-api-key"); //the client sends the token in header
  if (!token) {
    sendError(res, 401, "You must log in first");
    return;
  }
  try {
    const decoded = jwt.verify(token, getSecret()); //throws an error if the token is not valid
    if (typeof decoded === "string" || decoded.role !== "admin") {
      sendError(res, 401, "You must be an admin");
      return;
    }
    next(); //when everything is alright, continue to the route
  } catch {
    sendError(res, 401, "Your login expired, please log in again");
  }
}
