import type { Ticket } from "../type/ticket.js";

function cell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`; //put the value in quotes and double any quote inside it, so commas in the text don't break the columns
}

//uibld the text of the CSV file from the tickets
export function ticketsToCsv(tickets: Ticket[]): string {
  const header = [
    "Ticket ID", "Title", "Customer Name", "Email", "Phone", "Category",
    "Priority", "Status", "Description", "Created At", "Updated At",
  ];

  const rows = tickets.map((t) =>
    [t.id, t.title, t.customerName, t.email, t.phone, t.category,
     t.priority, t.status, t.description, t.createdAt, t.updatedAt].map(cell).join(",")
  );

  return [header.map(cell).join(","), ...rows].join("\n");
}

