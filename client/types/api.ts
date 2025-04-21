export type RouteApiType<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } }
