export type SuccessApiType<T> = {
  success: true
  data: T
}

export type ErrorApiType = {
  success: false
  error: {
    message: string
    code?: string
  }
}

export type RouteApiType<T> = SuccessApiType<T> | ErrorApiType
