export enum TrackingEvent {
  REGISTER_EVENT = 'tracking.register.event',
  REGISTER_PAGE = 'tracking.register.page',
  REGISTER_METHOD = 'tracking.register.method',
}

export type RegistrationMethodType = 'standard' | 'purchase' | 'trial'

export enum RegistrationMethod {
  STANDARD = 'standard',
  PURCHASE = 'purchase',
  TRIAL = 'trial',
}
