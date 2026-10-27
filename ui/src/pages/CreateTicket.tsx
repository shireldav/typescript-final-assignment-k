import { useNavigate } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import { createTicket } from "../services/ticketApi";
import type { CreateTicketInput } from "../types/ticket";

//the form every customer sees, public page -> no login needed
export default function CreateTicket() {
  const nav = useNavigate();

  //the form calls this when it is valid -> it sends the ticket to the server
  //returns an error text for the form, or null when everything succeeded
  const doApi = async (ticket: CreateTicketInput): Promise<string | null> => {
    const response = await createTicket(ticket);
    if (!response.success) {
      return response.error; 
    }
    //we go to the confirmation page ONLY after the server saved the ticket
    //state-> passing the ticket number to the next page
    nav("/confirmation", { state: { ticketId: response.data.id } });
    return null;
  };


  return (
    <section className="rounded border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Open a support ticket</h1>
      <p className="mb-6 mt-1 text-sm text-slate-600">
        Describe the problem
      </p>
      <TicketForm onSend={doApi} />
    </section>
  );
}

