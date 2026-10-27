import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode; //the page that we want to protect
}

//notice! this only hides the existence of the page, the actual protection is the "auth" middleware on the server.
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  if (!token) { //no token -> go to the login page, with a token -> show the page
    return <Navigate to="/login" replace />;
  }
  return children;
}
