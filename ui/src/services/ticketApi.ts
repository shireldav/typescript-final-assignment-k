import type { ApiResponse } from "../types/api";
import { API_URL, getHeaders, request } from "./api";
import type { CreateTicketInput, LoginInput, LoginResult, Ticket, UpdateTicketInput } from "../types/ticket";

//the components call these, so no component has its own fetch.

// POST /tickets -> create a ticket (public)
export function createTicket(input: CreateTicketInput) {
  return request<Ticket>("/tickets", "POST", input);
}

// GET /tickets -> all the tickets (admin)
export function getTickets() {
  return request<Ticket[]>("/tickets");
}

// GET /tickets/:id -> get one ticket by id (admin)
export function getTicketById(id: string) {
  return request<Ticket>(`/tickets/${id}`);
}

// PATCH /tickets/:id -> change status/priority (admin)
export function updateTicket(id: string, update: UpdateTicketInput) {
  return request<Ticket>(`/tickets/${id}`, "PATCH", update);
}

// DELETE /tickets/:id -> delete a ticket by id (admin)
export function deleteTicket(id: string) {
  return request<{ id: string }>(`/tickets/${id}`, "DELETE");
}

// POST /admin/login -> returns a token
export function login(input: LoginInput) {
  return request<LoginResult>("/admin/login", "POST", input);
}

// GET /tickets/export/csv -> the answer is a FILE and not JSON, so it can't use request()
//we get the file, and make the browser download it
export async function downloadCsv(): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_URL}/tickets/export/csv`, { headers: getHeaders(false) });
    if (!response.ok) {
      return { success: false, error: "Could not export the tickets" };
    }
    const blob = await response.blob(); // blob -> the raw file
    const url = URL.createObjectURL(blob); //a temporary address for the file
    const link = document.createElement("a"); //a hidden link that we click by code
    link.href = url;
    link.download = "tickets.csv"; //the name of the downloaded file
    link.click();
    URL.revokeObjectURL(url); // lean up
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Could not reach the server, please try again" };
  }
}

