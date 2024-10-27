import { equals, filter, head, pipe, prop } from 'ramda'

export const functionSelector =
  (namePattern: (type: string) => string) => (functions: Array<Function>) => (type: string) =>
    (pipe as any)((filter as any)(pipe((prop as any)('name'), equals(namePattern(type)))), head)(functions)
