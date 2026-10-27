import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog"; //alert dialog -> popup, like are you sure you want to do this?
import ErrorMessage from "./ErrorMessage";
import { deleteTicket } from "../services/ticketApi";
import type { Ticket } from "../types/ticket";

interface DeleteTicketDialogProps {
  ticket: Ticket | null; //null -> closed, ticket -> alert & ask if sure about deleting this ticket
  onClose: () => void;
  onDeleted: (id: string) => void; //tells the parent to remove the ticket from its list
}

export default function DeleteTicketDialog({ ticket, onClose, onDeleted }: DeleteTicketDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    if (!ticket) {
      return;
    }
    setIsDeleting(true);
    setError(null);
    const response = await deleteTicket(ticket.id);
    setIsDeleting(false);
    if (response.success) {
      onDeleted(ticket.id);
    } else {
      setError(response.error); //notice! the dialog stays open, so the admin can try again
    }
  };


  return (
    <AlertDialog.Root open={ticket !== null} onOpenChange={(open) => { if (!open) { setError(null); onClose(); } }}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-xl">
          <AlertDialog.Title className="text-lg font-bold">Delete this ticket?</AlertDialog.Title>
          {/* explain what will be deleted */}
          <AlertDialog.Description className="mt-2 text-sm text-slate-600">
            "{ticket?.title}" from the customer {ticket?.customerName} will be deleted, you cannot undo this step
          </AlertDialog.Description>

          {error && <div className="mt-3"><ErrorMessage message={error} /></div>}

          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-50">
              Cancel
            </AlertDialog.Cancel>
            {/* e.preventDefault(), by default action closes the dialog at once, we want it to close only after the server answered. */}
            <AlertDialog.Action
              onClick={(e) => { e.preventDefault(); onDelete(); }}
              disabled={isDeleting}
              className="rounded bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-60">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
