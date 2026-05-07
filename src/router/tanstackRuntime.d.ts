import React from 'react'

export const Outlet: React.ComponentType
export const RouterProvider: React.ComponentType<{ router: any }>

export class RootRoute {
  constructor(options: any)
  addChildren(children: any[]): any
}

export class Route {
  constructor(options: any)
}

export class Router {
  constructor(options: any)
  history: any
  state: any
}

export function useParams(options?: any): any
export function useRouter(): any
export function useRouterState(options?: any): any
