import type { ApiResponse } from "../types/api";


export const API_URL: string = import.meta.env.VITE_API_URL;

//token is saved in browser after login
export function getToken(): string | null {
  return localStorage.getItem("token");
}

//headers of req, has or added token x-api-key when admin is logged in
export function getHeaders(hasBody: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers["Content-Type"] = "application/json"; //tells the server the body is json
  }
  const token = getToken();
  if (token) {
    headers["x-api-key"] = token;
  }
  return headers;
}

//general request function & the only place that uses fetch
export async function request<T>(path: string, method = "GET", body?: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`,
      {
      method,
      headers: getHeaders(body !== null),
      body: body !== null ? JSON.stringify(body) : null, //body must be sent as text, str
    });

    const result: ApiResponse<T> = await response.json();
    return result;
  } catch {
    //the server is down, or no internet
     return { success: false, error: "Could not reach the server, please try again" };
    }
}
