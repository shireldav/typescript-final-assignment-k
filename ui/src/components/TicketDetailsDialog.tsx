import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import * as Dialog from "@radix-ui/react-dialog"; //popup window
import { } from "../services/ticketApi";
import { } from "../types/ticket";
import type { } from "../types/ticket";
import { formatDate } from "../utils/formatDate";

interface TicketDetailsDialogProps {
}
