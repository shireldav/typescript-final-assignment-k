//all the types of the server are here, in one place

export const categories = ["Hardware", "Software", "Network", "Account", "Other"] as const;
export const priorities = ["Low", "Medium", "High"] as const;
export const statuses = ["Open", "In Progress", "Resolved"] as const;

//turning each array into a single type
export type Category = (typeof categories)[number];
export type Priority = (typeof priorities)[number];
export type Status = (typeof statuses)[number];

//what the public form sends
export interface CreateTicketInput {
  customerName: string;
  email: string;
  phone: string;
  title: string;
  category: Category;
  priority: Priority;
  description: string;
}

export interface UpdateTicketInput { //admin can update and existing ticket
  status?: Status; //? -> admin can send one of them, optional
  priority?: Priority;
}

//saved in mongodb
export interface TicketDocument extends CreateTicketInput {
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

//what the client receives -> (_)id & date become strs
export interface Ticket extends CreateTicketInput {
  id: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

//the admin saved in mongodb (psw will be hashed)
export interface AdminDocument {
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}
