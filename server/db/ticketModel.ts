import mongoose from "mongoose";
import Joi from "joi"; //validation library
import { categories, priorities, statuses } from "../type/ticket.js";
import type { CreateTicketInput, TicketDocument, UpdateTicketInput } from "../type/ticket.js";

//ticket
const schema = new mongoose.Schema<TicketDocument>({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, enum: [...categories], required: true }, //... is spread operator, so keep and copy other fields except the following which is categories, can change
  priority: { type: String, enum: [...priorities], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: [...statuses], default: "Open" }, //every new ticket starts as open
}, { timestamps: true }); 

export const TicketModel = mongoose.model<TicketDocument>("tickets", schema);


//body validation for creating a ticket
export const validTicket = (_reqBody: unknown) => {
  const joiSchema = Joi.object<CreateTicketInput>({
    customerName: Joi.string().trim().min(2).max(100).required().label("Full name"), //trim() removes spaces, so "   " is not valid
    email: Joi.string().trim().min(2).max(100).email().required().label("Email"),
    phone: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).required().label("Phone"),
    title: Joi.string().trim().min(3).max(100).required().label("Title"),
    category: Joi.string().valid(...categories).required().label("Category"), //must be one of the list
    priority: Joi.string().valid(...priorities).required().label("Priority"),
    description: Joi.string().trim().min(10).max(2000).required().label("Description"),
  });
  return joiSchema.validate(_reqBody);
};

//body validation for what was updated -> only status and priority, and at least one of them
export const validUpdate = (_reqBody: unknown) => {
  const joiSchema = Joi.object<UpdateTicketInput>({
    status: Joi.string().valid(...statuses).label("Status"),
    priority: Joi.string().valid(...priorities).label("Priority"),
  }).or("status", "priority"); //.or -> at least one of them must exist
  
  return joiSchema.validate(_reqBody);
};
