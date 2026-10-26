import bcrypt from "bcrypt";
import type { Types } from "mongoose";
import { AdminModel } from "./adminModel.js";
import { TicketModel } from "./ticketModel.js";
import type { AdminDocument, CreateTicketInput, Ticket, TicketDocument, UpdateTicketInput } from "../type/ticket.js";

//a ticket as it comes from mongodb -> our fields + the _id that MongoDB adds
type TicketFromDb = TicketDocument & { _id: Types.ObjectId };

//convert what is in mongodb to what we send to the client (_id -> id, string, dates -> strings)
function toTicket(doc: TicketFromDb): Ticket {
  return {
    id: doc._id.toString(),
    customerName: doc.customerName,
    email: doc.email,
    phone: doc.phone,
    title: doc.title,
    category: doc.category,
    priority: doc.priority,
    description: doc.description,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

//notice! routes never speak with mongodb directly, only through the following functions

//ticket funcs:

//create a new ticket 
export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const ticket = new TicketModel(input);
  await ticket.save();
  return toTicket(ticket);
}

//get all the tickets, the newest first
export async function getTickets(): Promise<Ticket[]> {
  const docs = await TicketModel.find({})
  .sort({ createdAt: -1 }); // -1-> desc, from new to old
  return docs.map(toTicket);
}

//get one ticket by id, null if it doesn't exist
export async function getTicketById(id: string): Promise<Ticket | null> {
  const doc = await TicketModel.findOne({ _id: id });
  if (!doc) {
    return null;
  }
  return toTicket(doc);
}

//update status/priority 
export async function updateTicket(id: string, update: UpdateTicketInput): Promise<Ticket | null> {
  const doc = await TicketModel.findOneAndUpdate({ _id: id }, update, { new: true }); //new:true -> in order to give ticket after update
  if (!doc) {
    return null;
  }
  return toTicket(doc);
}

//delete a ticket, true if it was deleted, false if it wasn't found
export async function deleteTicket(id: string): Promise<boolean> {
  const result = await TicketModel.deleteOne({ _id: id });
  return result.deletedCount === 1;
}



//admin funcs:

export async function findAdmin(username: string): Promise<AdminDocument | null> {
  return AdminModel.findOne({ username });
}

//admin "already exists in the system", so when the server starts we create it if it isn't there yet
export async function createAdminIfMissing(username: string, password: string): Promise<void> {
  const existing = await findAdmin(username);
  if (existing) {
    return;
  }
  const hashed = await bcrypt.hash(password, 10); //10 -> decent encryption level
  await new AdminModel({ username, password: hashed }).save();
  console.log("Admin user created");
}
