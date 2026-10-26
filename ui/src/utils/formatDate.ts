//turns date more readable, like 10/03/2026, 10:15, trick learnt earlier
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });
}
