import { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import DeleteTicketDialog from "../components/DeleteTicketDialog";
import TicketDetailsDialog from "../components/TicketDetailsDialog";
import TicketList from "../components/TicketList";
import { downloadCsv, getTickets } from "../services/ticketApi";
import { categories, priorities, statuses } from "../types/ticket";
import type { Ticket } from "../types/ticket";

const inputClass = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2";

//notice! this page is the parent of tickets list so -> ticketcard (one ticket) - ticketlist - tickets (page) (started from child to parent)
//serves as a ticket management page -> list of tickets, searches, filters, details, update, delete, export csv
export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]); //all of the tickets from the server
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //search "" and filter "All" means don't filter by this specific field
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");

  //note which dialog is open the, details one (we keep only the id) or the delete one (we keep the ticket)
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  //load the tickets once, when the page opens
  useEffect(() => {
    doApi();
  }, []);

  const doApi = async () => {
    setIsLoading(true);
    setError(null);
    const response = await getTickets();
    if (response.success) {
      setTickets(response.data);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  };

  //search & filters run on the arr we already have (no request to the server)
  //a ticket stays in the list only if it passes ALL of the conditions combined
  const query = search.trim().toLowerCase(); // lower case, so "Printer" and "printer" are the same
  const visibleTickets = tickets.filter((t) => {
    const matchesSearch =
      query === "" || //no search -> everything matches
      t.title.toLowerCase().includes(query) ||
      t.customerName.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query);

    return (
      matchesSearch &&
      (status === "All" || t.status === status) &&
      (priority === "All" || t.priority === priority) &&
      (category === "All" || t.category === category)
    );
  });

  //after an update we replace that ticket in the state, so the screen changes without a refresh
  const onUpdated = (updated: Ticket) => {
    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
  };

  //after a delete we remove the ticket from the state, and close the dialog
  const onDeleted = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
    setTicketToDelete(null);
  };

  const onExport = async () => {
    setExportError(null);
    const response = await downloadCsv();
    if (!response.success) {
      setExportError(response.error);
    }
  };


  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <button onClick={onExport} className="rounded border border-slate-300 bg-white px-4 py-2 hover:bg-slate-50">
          Export CSV
        </button>
      </div>
      {exportError && <ErrorMessage message={exportError} />}

      {/* search & filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          Search
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Title, name or email" className={inputClass} />
        </label>
        <label className="block">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="All">All</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass}>
            <option value="All">All</option>
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="block">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="All">All</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      {isLoading && <Loading text="Loading tickets..." />}
      {error && <ErrorMessage message={error} onRetry={doApi} />}
      {!isLoading && !error && (
        <TicketList
          tickets={visibleTickets}
          totalCount={tickets.length}
          onView={(t) => setOpenTicketId(t.id)}
          onDelete={(t) => setTicketToDelete(t)}
        />
      )}

      {/* the two dialogs are closed when their state is null */}
      <TicketDetailsDialog ticketId={openTicketId} onClose={() => setOpenTicketId(null)} onUpdated={onUpdated} />
      <DeleteTicketDialog ticket={ticketToDelete} onClose={() => setTicketToDelete(null)} onDeleted={onDeleted} />
    </section>
  );
}
