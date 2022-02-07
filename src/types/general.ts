export type Category = {
  id: string
  name: string
  position?: number
}

export type ProductRoleName = 'owner' | 'instructor' | 'assistant' | 'app-owner'
export type StatusType = 'loading' | 'error' | 'success' | 'idle'
