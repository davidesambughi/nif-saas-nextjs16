import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";
import * as schema from "./schema/index";

/**
 * Drizzle ORM client singleton with connection pooling.
 * Supabase Transaction Pooler recommended for stateless serverless functions.
 * All repositories import from this file — never create standalone clients.
 */

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
