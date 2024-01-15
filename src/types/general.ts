import { PodcastProgramProps } from '../containers/podcast/PodcastProgramTimeline'
import { ActivitySessionTicketEnrollment } from './activity'
import { PodcastPlanEnrollment } from './podcast'
import { ProgramEnrollment } from './program'
import { ProgramPackageEnrollment } from './programPackage'

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

interface IpApiResponse {
  ip: string
}

export interface IpApiResponseSuccess extends IpApiResponse {
  network: string
  version: string
  city: string
  region: string
  region_code: string
  country: string
  country_name: 'Taiwan'
  country_code: 'TW'
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal: string | null
  latitude: number
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org: string
  error?: false
}

export interface IpApiResponseFail {
  error: true
  reason: string
}

export type SignupProperty = {
  id: string
  propertyId: string
  type: string
  name: string
  isRequired: boolean
  placeHolder?: string
  selectOptions?: string[]
  ruleMessage?: string
  rowAmount?: number
}

export type MemberPageProductType =
  | 'program'
  | 'expiredProgram'
  | 'programPackage'
  | 'expiredProgramPackage'
  | 'podcast'
  | 'podcast-plan'
  | 'activity'

export type ProductData<T extends MemberPageProductType> = T extends 'program'
  ? ProgramEnrollment
  : T extends 'expiredProgram'
  ? ProgramEnrollment
  : T extends 'programPackage'
  ? ProgramPackageEnrollment
  : T extends 'expiredProgramPackage'
  ? ProgramPackageEnrollment
  : T extends 'podcast'
  ? PodcastProgramProps
  : T extends 'podcast-plan'
  ? PodcastPlanEnrollment
  : T extends 'activity'
  ? ActivitySessionTicketEnrollment
  : never
