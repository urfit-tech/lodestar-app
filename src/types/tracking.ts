export type RegistrationMethod = 'standard' | 'purchase' | 'trial'

export type TrackingEvent = {
  event: string
  method: string
  page: string
}

export type RegisterEvent = Omit<TrackingEvent, 'event'> & {
  event: 'register'
  method: RegistrationMethod
  page: string
}
