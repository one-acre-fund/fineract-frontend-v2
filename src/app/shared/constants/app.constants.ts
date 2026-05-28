// src/app/shared/constants/app.constants.ts
export const APP_CONSTANTS = {
  SYSTEM_CONFIGURATIONS: {
    LOAN_QUALIFICATION_RULES: 'loan-qualification-rules-required',
    SKIP_COUNTRY_SPECIFIC_CHECKS: 'skip-country-specific-checks',
    RESTRICT_CLIENT_INFO_EDIT_WHEN_THEY_HAVE_ACTIVE_LOANS: "restrict-client-info-edit-when-they-have-active-loans"
  },
  SESSION_STORAGE: {
    SELECTED_COUNTRY: 'selectedCountry',
    MIFOS_CREDENTIALS: 'mifosXCredentials'
  },
  LOAN_STATUSES: {
    SUBMITTED_AND_PENDING_APPROVAL: 100,
    APPROVED:200,
    ACTIVE: 300,

  }
} as const;