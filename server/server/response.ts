import type { Response } from "express";
import type { ApiResponse } from "../type/api.js";

//use pattern, so зevery answer has the same shape -> { success, data }, { success, error }

export function sendOk<T>(res: Response, status: number, data: T): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendError(res: Response, status: number, error: string): void {
  const body: ApiResponse<never> = { success: false, error }; //never -> when there is no data in error
  res.status(status).json(body);
}
