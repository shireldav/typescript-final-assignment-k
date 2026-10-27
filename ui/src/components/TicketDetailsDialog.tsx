import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog"; //popup window
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import { getTicketById, updateTicket } from "../services/ticketApi";
import { isPriority, isStatus, priorities, statuses } from "../types/ticket";
import type { Priority, Status, Ticket } from "../types/ticket";
import { formatDate } from "../utils/formatDate";

interface TicketDetailsDialogProps {
  ticketId: string | null; //null > the dialog is closed, id -> signaling to open the ticket
  onClose: () => void;
  onUpdated: (ticket: Ticket) => void; //tells the parent that the ticket changed
}

const inputClass = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2";

export default function TicketDetailsDialog({ ticketId, onClose, onUpdated }: TicketDetailsDialogProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("Open");
  const [priority, setPriority] = useState<Priority>("Low");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  //every time a different ticket is opened, we ask the server for its full details
  useEffect(() => {
    if (ticketId === null) {
      return; //the dialog is closed, nothing to load
    }
    doApi(ticketId);
  }, [ticketId]);

  const doApi = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setSaveError(null);
    setTicket(null);
    const response = await getTicketById(id);
    setIsLoading(false);
    if (response.success) {
      setTicket(response.data);
      setStatus(response.data.status); //the selects start with the ticket's current (default) values
      setPriority(response.data.priority);
    } else {
      setError(response.error);
    }
  };

  //save button send the new status and priority to the server
  const onSave = async () => {
    if (!ticket) {
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    const response = await updateTicket(ticket.id, { status, priority });
    setIsSaving(false);
    if (response.success) {
      setTicket(response.data); //show the updated ticket (including date)
      onUpdated(response.data); //the parent changes its list, so the screen updates without refresh
    } else {
      setSaveError(response.error);
    }
  };


  return (
    //open={...} -> the dialog is open only when we have a ticketId
    //onopenchange runs when the user closes it
    <Dialog.Root open={ticketId !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" /> {/* the dark background */}
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[90vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-bold">Ticket details</Dialog.Title>
          <Dialog.Description className="text-sm text-slate-600">
            You can change the status and the priority
          </Dialog.Description>

          {isLoading && <Loading text="Loading ticket..." />}
          {error && <ErrorMessage message={error} />}

          {ticket && (
            <div className="mt-4 space-y-3 text-sm">
              <p><b>Title:</b> {ticket.title}</p>
              <p><b>Customer:</b> {ticket.customerName}</p>
              <p><b>Email:</b> {ticket.email}</p>
              <p><b>Phone:</b> {ticket.phone}</p>
              <p><b>Category:</b> {ticket.category}</p>
              <p><b>Created:</b> {formatDate(ticket.createdAt)}</p>
              <p><b>Updated:</b> {formatDate(ticket.updatedAt)}</p>
              <p className="whitespace-pre-wrap rounded bg-slate-50 p-3">{ticket.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  Status
                  {/* the guard checks that the text from the select is a real status */}
                  <select value={status} className={inputClass}
                    onChange={(e) => { if (isStatus(e.target.value)) setStatus(e.target.value); }}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="block">
                  Priority
                  <select value={priority} className={inputClass}
                    onChange={(e) => { if (isPriority(e.target.value)) setPriority(e.target.value); }}>
                    {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
              </div>

              {saveError && <ErrorMessage message={saveError} />}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-50">
              Close
            </Dialog.Close>
            {ticket && (
              <button onClick={onSave} disabled={isSaving}
                className="rounded bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
