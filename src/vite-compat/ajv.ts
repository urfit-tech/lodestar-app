type BasicSchema = {
  type?: string
  nullable?: boolean
  properties?: Record<string, BasicSchema>
  required?: string[]
  items?: BasicSchema
}

type Validator = ((value: unknown) => boolean) & {
  errors?: string[] | null
}

export type JSONSchemaType<T> = BasicSchema & {
  __type?: T
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isValidValue = (schema: BasicSchema, value: unknown): boolean => {
  if (value === null || value === undefined) {
    return Boolean(schema.nullable)
  }

  switch (schema.type) {
    case 'array':
      return Array.isArray(value) && (!schema.items || value.every(item => isValidValue(schema.items!, item)))
    case 'boolean':
      return typeof value === 'boolean'
    case 'number':
    case 'integer':
      return typeof value === 'number'
    case 'object':
      return isObject(value) && validateObject(schema, value)
    case 'string':
      return typeof value === 'string'
    default:
      return true
  }
}

const validateObject = (schema: BasicSchema, value: Record<string, unknown>): boolean => {
  const required = schema.required || []

  if (required.some(key => !(key in value))) {
    return false
  }

  return Object.entries(schema.properties || {}).every(([key, propertySchema]) => {
    if (!(key in value)) return true
    return isValidValue(propertySchema, value[key])
  })
}

export default class Ajv {
  compile(schema: BasicSchema): Validator {
    const validate = ((value: unknown) => {
      const isValid = isValidValue(schema, value)
      validate.errors = isValid ? null : ['value does not match schema']
      return isValid
    }) as Validator

    validate.errors = null
    return validate
  }
}
