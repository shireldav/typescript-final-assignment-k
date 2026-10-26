import { Router } from "express";
import type { Request, Response } from "express";
import { sendError, sendOk } from "./response.js";
import { createTicket, deleteTicket, getTicketById, getTickets, updateTicket } from "../db/actions.js";
import { validTicket, validUpdate } from "../db/ticketModel.js";
import { auth } from "./auth.js";
import { ticketsToCsv } from "./csv.js";

const router = Router();

//notice! there is no /tickets here, because index.ts connects this router to /tickets automatically.

//a real id is 24 characters of 0-9 and a-f, we check it before we speak to and ask mongodb
function isValidId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}


// POST -> create a ticket
//public (no token), this is the form every customer uses
router.post("/", async (req: Request, res: Response) => {
  const { error, value } = validTicket(req.body); 
  if (error) {
    sendError(res, 400, error.details[0].message); //wrong data sent
    return;
  }
  try {
    const ticket = await createTicket(value); //value-> clean body, already typed
    sendOk(res, 201, ticket); //ticket created successfully
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Something went wrong on the server");
  }
});


// GET -> all the tickets
//admin only (authenticate)
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    sendOk(res, 200, await getTickets());
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Something went wrong on the server");
  }
});


// GET -> export all the tickets as a CSV file
//admin only
//notice! this route must be BEFORE "/:id", otherwise express thinks "export" is an id
router.get("/export/csv", auth, async (req: Request, res: Response) => {
  try {
    const tickets = await getTickets();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="tickets.csv"'); //tells the browser to download it
    res.status(200).send(ticketsToCsv(tickets));
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Something went wrong on the server");
  }
});


// GET -> one ticket by id
//admin only (authenticate)
router.get("/:id", auth, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!isValidId(id)) {
    sendError(res, 400, "Ticket ID is not valid");
    return;
  }
  try {
    const ticket = await getTicketById(id);
    if (!ticket) {
      sendError(res, 404, "Ticket not found"); //ticket does not exist
      return;
    }
    sendOk(res, 200, ticket);
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Something went wrong on the server");
  }
});


// PATCH -> change the status and/or the priority
//admin only (authenticate)
//the admin can change part of the ticket, not all fields
router.patch("/:id", auth, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!isValidId(id)) {
    sendError(res, 400, "Ticket ID is not valid");
    return;
  }
  const { error, value } = validUpdate(req.body);
  if (error) {
    sendError(res, 400, error.details[0].message);
    return;
  }
  try {
    const ticket = await updateTicket(id, value);
    if (!ticket) {
      sendError(res, 404, "Ticket not found");
      return;
    }
    sendOk(res, 200, ticket); //we send back the updated ticket, so the UI can show it
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Something went wrong on the server");
  }
});


// DELETE -> delete a ticket
//admin only
router.delete("/:id", auth, async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!isValidId(id)) {
    sendError(res, 400, "Ticket ID is not valid");
    return;
  }
  try {
    const isDeleted = await deleteTicket(id);
    if (!isDeleted) {
      sendError(res, 404, "Ticket not found");
      return;
    }
    sendOk(res, 200, { id });
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Something went wrong on the server");
  }
});

export default router;
