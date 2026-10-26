import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  pageChildren: ReactNode; // the page that we want to protect
}


