/**
 * Schema barrel export.
 * Import from "@/db/schema" to access all tables and types.
 *
 * Relations are defined separately in relations.ts to avoid circular imports.
 */
export * from "./enums";
export * from "./users";
export * from "./orders";
export * from "./documents";
export * from "./status-updates";
