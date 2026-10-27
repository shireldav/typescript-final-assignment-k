import { Link, Navigate, useLocation } from "react-router-dom";

//the page after a ticket was saved successfully
export default function Confirmation() {
  const location = useLocation(); //current page the user is on
  const state : unknown = location.state;

  //check that the state really has a ticketId (str) inside of it
  let ticketId = "";
  if (typeof state === "object" && state !== null && "ticketId" in state && typeof state.ticketId === "string") {
    ticketId = state.ticketId;
  }

  //if someone opened /confirmation by typing the path address, there is no ticket, so go back to the form
  if (ticketId === "") {
    return <Navigate to="/" replace />;
  }


  return (
    <section className="rounded border border-emerald-300 bg-white p-6">
      <h1 className="text-2xl font-bold text-emerald-800">Your support ticket was submitted successfully</h1>
      <p className="mt-3">
        Your ticket ID is <b>{ticketId}</b>.
      </p>
      <Link to="/" className="mt-5 inline-block rounded bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800">
        Open another ticket
      </Link>
    </section>
  );
}