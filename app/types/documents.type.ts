import type { Database } from "./database.types";

export type Document = Database["public"]["Tables"]["documents"]["Row"] & {
  label?: "local" | "cloud";
};

export type DocumentWithBlob = Document & { blob: Blob };

export type InsertDocument =
  Database["public"]["Tables"]["documents"]["Insert"];
export type UpdateDocument =
  Database["public"]["Tables"]["documents"]["Update"];
