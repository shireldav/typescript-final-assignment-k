import type { Ticket } from "../types/ticket";
import TicketCard from "./TicketCard";

interface TicketListProps {
  tickets: Ticket[]; //the tickets after search and filters
  totalCount: number; //how many tickets exist before search and filters
  onView: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

export default function TicketList({ tickets, totalCount, onView, onDelete }: TicketListProps) {
  //first empty case -> there are no tickets at all
  if (totalCount === 0) {
    return <p className="rounded border border-dashed border-slate-300 p-6 text-center">No support tickets were found.</p>;
  }
  //second empty case -> there are tickets, but the search/filters hide all of them
  if (tickets.length === 0) {
    return <p className="rounded border border-dashed border-slate-300 p-6 text-center">No tickets match the current search and filters.</p>;
  }
  
  return (
    <ul className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onView={onView} onDelete={onDelete} />
      ))}
    </ul>
  );
}
