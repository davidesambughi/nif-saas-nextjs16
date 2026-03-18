/**
 * Shared TypeScript types for the application boundary layer.
 * All Server Actions return ActionResult<T> — never throw to the client.
 */

/**
 * Discriminated union for all server action return values.
 * Provides a consistent, type-safe error handling pattern client-side.
 *
 * @example
 * const result = await createOrder(data);
 * if (!result.success) {
 *   toast.error(result.error);
 *   return;
 * }
 * router.push(`/order/success?id=${result.data.orderId}`);
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; fieldErrors?: FieldErrors };

/**
 * Field-level validation errors — mirrors Zod's fieldErrors format.
 */
export type FieldErrors = Record<string, string[]>;

/**
 * Pagination helpers for list queries.
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  totalPages: number;
}
