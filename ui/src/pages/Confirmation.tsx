import { Link, Navigate, useLocation } from "react-router-dom";

// The page after a ticket was saved successfully
export default function Confirmation() {
  const location = useLocation(); //current page the user is on
  const state = location.state as ConfirmationLocationState | null;

}