import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Resend SDK singleton.
 * Never instantiate inline — import this instance for all transactional email calls.
 */
export const resend = new Resend(env.RESEND_API_KEY);
