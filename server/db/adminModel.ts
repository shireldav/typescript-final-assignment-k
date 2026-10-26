import mongoose from "mongoose";
import Joi from "joi";
import type { AdminDocument, LoginInput } from "../type/ticket.js";


//admin
//(first admin is created when the server starts)
const schema = new mongoose.Schema<AdminDocument>({
  username: { type: String, required: true, unique: true }, //unique so no two admins with the same name
  password: { type: String, required: true }, //psw saved hashed with bcrypt
});

export const AdminModel = mongoose.model<AdminDocument>("admins", schema);


export const validLogin = (_reqBody: unknown) => {
  const joiSchema = Joi.object<LoginInput>({
    username: Joi.string().trim().min(2).max(100).required().label("Username"),
    password: Joi.string().min(3).max(100).required().label("Password"),
  });
  return joiSchema.validate(_reqBody);
};
