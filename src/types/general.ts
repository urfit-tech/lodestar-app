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

export type MetaTag = {
  seo?: { pageTitle?: string; description: string; keywords?: string }
  openGraph?: { title?: string; description?: string; image?: string; imageAlt?: string }
}

export type Tag = {
  name: string
  type: string
  filterable: boolean
}
