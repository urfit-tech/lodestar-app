/**
 * Facebook Conversions API frontend switch.
 *
 * Same contract as lodestar-app-element/src/helpers/conversionApi.ts (isConversionApiEnabled); kept local so this
 * app does not need to bump the lodestar-app-element tag first. Switch to the element export once the pinned
 * tag includes it.
 *
 * The browser never sees tracking.fb_conversion_api.access_token (blocked for every browser role). The backend
 * reads it server side when POST /api/v1/tracking is called, so the frontend only checks the public boolean
 * setting tracking.fb_conversion_api.enabled ('1') and the fb_conversion_api module.
 */
export const FB_CONVERSION_API_ENABLED_SETTING = 'tracking.fb_conversion_api.enabled'

export const isConversionApiEnabled = (
  settings: Record<string, string>,
  enabledModules: { fb_conversion_api?: boolean },
): boolean => settings[FB_CONVERSION_API_ENABLED_SETTING] === '1' && Boolean(enabledModules.fb_conversion_api)
