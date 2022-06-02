export type Category = {
  id: string
  name: string
  position?: number
}

export type ProductRoleName = 'owner' | 'instructor' | 'assistant' | 'app-owner' | 'author'
export type StatusType = 'loading' | 'error' | 'success' | 'idle'
export type ApiResponse<T = null> = {
  code: string
  message: string
  result: T
}
