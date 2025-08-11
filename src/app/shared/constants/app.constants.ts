// src/app/shared/constants/app.constants.ts
export const APP_CONSTANTS = {
  SYSTEM_CONFIGURATIONS: {
    LOAN_QUALIFICATION_RULES: 'loan-qualification-rules-required',
    SKIP_COUNTRY_SPECIFIC_CHECKS: 'skip-country-specific-checks'
  },
  SESSION_STORAGE: {
    SELECTED_COUNTRY: 'selectedCountry',
    MIFOS_CREDENTIALS: 'mifosXCredentials'
  },
  LOAN_STATUSES: {
    APPROVED:200,
    ACTIVE: 300,

  }
} as const;