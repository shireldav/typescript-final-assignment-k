//the allowed values (same lists as in the server)
export const categories = ["Hardware", "Software", "Network", "Account", "Other"] as const;
export const priorities = ["Low", "Medium", "High"] as const;
export const statuses = ["Open", "In Progress", "Resolved"] as const;

export type Category = (typeof categories)[number];
export type Priority = (typeof priorities)[number];
export type Status = (typeof statuses)[number];

//type guards: a <select> gives us a plain str -> these check it is a real value and notify typescript about it
export function isCategory(value: unknown): value is Category {
  return categories.some((c) => c === value);
}
export function isPriority(value: unknown): value is Priority {
  return priorities.some((p) => p === value);
}
export function isStatus(value: unknown): value is Status {
  return statuses.some((s) => s === value);
}

//a ticket as the server sends it
export interface Ticket {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  title: string;
  category: Category;
  priority: Priority;
  description: string;
  status: Status;
  createdAt: string; 
  updatedAt: string;
}

//what the form sends to the server (no id, no status, no dates, the server sets them)
export interface CreateTicketInput {
  customerName: string;
  email: string;
  phone: string;
  title: string;
  category: Category;
  priority: Priority;
  description: string;
}

//what the admin can change
export interface UpdateTicketInput {
  status?: Status;
  priority?: Priority;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

//while the user is typing, every field of the form is just a string
//(category and priority are "" until the user chooses)
export interface TicketFormState {
  customerName: string;
  email: string;
  phone: string;
  title: string;
  category: string;
  priority: string;
  description: string;
}

//one error message per field (only for the fields that are wrong)
export type TicketFormErrors = Partial<Record<keyof TicketFormState, string>>;

