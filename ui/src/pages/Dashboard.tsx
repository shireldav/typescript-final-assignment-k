import { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { getTickets } from "../services/ticketApi";
import type { Ticket } from "../types/ticket";

//admin dashboard -> concluded data & stats about the tickets
export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    doApi();
  }, []); //loading the page data once, when the page opens

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

  const stats = [
    { label: "Total Tickets", value: tickets.length },
    { label: "Open", value: tickets.filter((t) => t.status === "Open").length },
    { label: "In Progress", value: tickets.filter((t) => t.status === "In Progress").length },
    { label: "Resolved", value: tickets.filter((t) => t.status === "Resolved").length },
    { label: "High Priority", value: tickets.filter((t) => t.priority === "High").length },
  ];


  return (
    //note -> section is a divider, just more potent so it seems fitting here
    <section> 
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      {isLoading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={doApi} />}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
