import type { Ticket } from "../types/ticket";
import { formatDate } from "../utils/formatDate";

interface TicketCardProps {
  ticket: Ticket;
  onView: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

//for one (each single) ticket in the list
export default function TicketCard({ ticket, onView, onDelete }: TicketCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">{ticket.title}</p>
        <p className="text-sm text-slate-600">{ticket.customerName} · {ticket.category}</p>
        <p className="text-sm text-slate-600">
          Status: {ticket.status} · Priority: {ticket.priority}
        </p>
        <p className="text-xs text-slate-500">Created {formatDate(ticket.createdAt)}</p>
      </div>
      <div className="flex gap-2">
        {/* the card does not know how to view or delete, it only tells the parent (ticketlist) which ticket was clicked */}
        <button onClick={() => onView(ticket)} className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-50">
          View
        </button>
        <button onClick={() => onDelete(ticket)} className="rounded border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50">
          Delete
        </button>
      </div>
    </li>
  );
}
