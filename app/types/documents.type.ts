import type { Database } from "./database.types";

export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type InsertDocument =
  Database["public"]["Tables"]["documents"]["Insert"];
export type UpdateDocument =
  Database["public"]["Tables"]["documents"]["Update"];
