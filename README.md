# Ticket Desk Support Project in TypeScript

## Project Description
The system is a contact support ticket system. In the system, a customer can open a ticket from a public form freely with not registeration or logging in required. The system also includes an admin side, in which the admin is able to view a ticket dashboard, search and filter tickets by specific fields (for example by category, or priority), open and read a ticket, change its status or priority, delete it, and export all the tickets to a CSV file - these actions are possible only if the admin logs in first, to verify they are allowed at that endpoint.

## Starting Point
This project is based on my user management project from this course (TypeScript) and more heavily on my React (imdb vod) + Node.js (toys managment) + MongoDB projects completed for other courses. I kept the same structure: "ui" directory (frontend -> Vite + React) and "server" directory (backend -> Express with "server/", "db/", "type/"), the services layer, the "ApiResponse<T>" response type, the "Loading" & "ErrorMessage" components and the dialog components. I also reused basic patterns from my Node.js project (Mongoose models with Joi validation, bcrypt, JWT token and an auth middleware) and my React project ("useEffect" + "doApi", "isLoading", "useNavigate", "onSub"). I changed the data (users -> tickets), the components, types, the endpoints, the pages, explored React possibilities more and expanded functionalities to best fit this project's requirements.

## Technologies
- ui: Vite, React, TypeScript, TailwindCSS, Radix UI (Dialog, AlertDialog), React Router, fetch
- server: Node.js, Express, TypeScript, MongoDB (with Mongoose), Joi, bcrypt, jsonwebtoken, CORS
- GitHub

## Pages
### Pages that can be widely publicly accessed 
- CreateTicket: for creating and saving a ticket -> "/"
- Confirmation: sends a success (confirmation) message after a ticket had been saved successfully -> "/confirmation"
- Login: for admin log in -> "/login"

### Pages that can be accessed by an admin only
- Dashboard: for an admin to view ticket stats (total amount of tickets, tickets that are open, in progress, resolved, high priority) -> "/dashboard" 
- Tickets: for ticket management (view tickets list and details, search, filter, update, delete and export CSV file) -> "/tickets"

## Project Structure
|-- server
|    |-- db/
|    |    |-- index.ts
|    |    |-- adminModel.ts
|    |    |-- ticketModel.ts
|    |    |-- actions.ts
|    |-- server/
|    |    |-- index.ts
|    |    |-- csv.ts
|    |    |-- response.ts
|    |    |-- auth.ts
|    |    |-- adminRoutes.ts
|    |    |-- ticketRoutes.ts
|    |-- type/
|    |    |-- api.ts
|    |    |-- ticket.ts
|    |-- .env.example
|    |-- package.json
|    |-- tsconfig.json
|    
|-- ui
|    |-- src/
|    |   |-- components/
|    |   |   |-- Loading.tsx
|    |   |   |-- ErrorMessage.tsx
|    |   |   |-- Navbar.tsx
|    |   |   |-- ProtectedRoute.tsx
|    |   |   |-- TicketCard.tsx
|    |   |   |-- TicketForm.tsx
|    |   |   |-- TicketList.tsx
|    |   |   |-- TicketDetailsDialog.tsx
|    |   |   |-- DeleteTicketDialog
|    |   |-- pages/
|    |   |    |-- Confirmation.tsx
|    |   |    |-- CreateTicket.tsx
|    |   |    |-- Login.tsx
|    |   |    |-- Dashboard.tsx
|    |   |    |-- Tickets.tsx
|    |   |-- services/
|    |   |    |-- api.ts
|    |   |    |-- ticketApi.ts
|    |   |-- types/
|    |   |   |-- api.ts
|    |   |   |-- ticket.ts
|    |   |-- utils/
|    |   |    |-- formatDate.ts
|    |   |-- App.tsx
|    |   |-- main.tsx
|    |   |-- index.css
|    |   |-- vite-env.d.ts
|    |-- .env.example
|    |-- index.html
|    |-- package.json
|    |-- vite.config.ts
|    
|-- README.md


different roles in directories: ui (frontend) - React shows the screen visually and keeps the state.
server (backend) - "services" talk to the server with fetch, Express receives the request, validates it with Joi and checks the login. "db/actions.ts" is the only place that talks to MongoDB.

## Data Model
admins collection: "username, password" (the password is hashed with bcrypt, never saved as plain text)
tickets collection: "title, customerName, email, phone, category, priority, description, status, createdAt, updatedAt"
sub categories in ticket:
Category: Hardware, Software, Network, Account, Other.
Priority: Low, Medium, High.
Status: Open, In Progress, Resolved.
The server sets "status" (always Open at the start) and the dates. The client can't send them, Joi rejects them.

## API
| Method | Endpoint | Function
|-------------------------------
| GET    | "/tickets"            | getting & viewing all tickets (admin)
| GET    | "/tickets/:id"        | getting & viewing one singular ticket by id (admin)
| GET    | "/tickets/export/csv" | building text out of & exporting tickets to CSV file (admin)
| POST   | "/tickets"            | creating a ticket (public) 
| POST   | "/admin/login"        | admin login, returns a token that an be used for verification in the future for actions like updating/deleting tickets, etc (public)
| PATCH  | "/tickets/:id"        | changing a status and or priority of a ticket (admin)
| DELETE | "/tickets/:id"        | deleting a ticket (admin)

Every JSON reply will be { success: true, data } or { success: false, error }.
Status codes: 200, 201 success, 400 (wrong data or wrong id), 401 (not logged in /wrong login), 404 (ticket not found), 500 (server error).

## Authentication
The admin is created from .env file when the server starts (the password is saved hashed). "POST /admin/login" checks the password with bcrypt and returns a JWT token (8 hours). The UI saves it in "localStorage" and sends it in the "x-api-key" header. Every admin route on the server uses the "auth" middleware. A page can also seem hidden, but it is not the actual security mechanism, the server checks if the token sent is valid. Logging out removes the token.

## Environment Variables
server/.env: "MONGO_DB", "TOKEN_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD", "CLIENT_URL"
ui/.env: "VITE_API_URL"

## Installation
cd server
npm i
cd ../ui
npm i

+ Copy ".env.example" to ".env" in both directories and fill in the secret values.

## Run
### run server
cd server
npm run dev      (http://localhost:3000)

### run client
cd ui
npm run dev      (http://localhost:5173)
