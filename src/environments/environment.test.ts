// `.env.ts` is generated by the `npm run env` command
import env from './.env';
import { commonEnvironments } from "./environment.common";

export const environment = {
  ...commonEnvironments,
  production: true,
  // For connecting to server running elsewhere update the tenant identifier
  fineractPlatformTenantId: window['env']['fineractPlatformTenantId'] || 'default',
  // For connecting to others servers running elsewhere update the base API URL
  baseApiUrls:
    window['env']['fineractApiUrls'] ||
    'https://dev.mifos.io,https://demo.mifos.io,https://qa.mifos.io,https://staging.mifos.io,https://mobile.mifos.io,https://loans.integration.oneacrefund.org,https://localhost:8443',
  // For connecting to server running elsewhere set the base API URL
  baseApiUrl: window['env']['fineractApiUrl'] || 'https://loans.integration.oneacrefund.org',
  allowServerSwitch: env.allow_switching_backend_instance,
  apiProvider: window['env']['apiProvider'] || '/fineract-provider/api',
  apiVersion: window['env']['apiVersion'] || '/v1',
  serverUrl: '',
  oauth: {
    enabled: true, // For connecting to Mifos X using OAuth2 Authentication change the value to true
    serverUrl: window['env']['authServerUrl'] || 'https://accounts.integration.oneacrefund.org',
    realm: window['env']['keycloakRealm'] || 'OneAcreFund',
    client_id: window['env']['keycloakClientId'] || 'fineract',
    tokenUrl: window['env']['keycloakTokenUrl'] || "https://loans.integration.oneacrefund.org/auth/realms/OneAcreFund/protocol/openid-connect/token",
    redirectUri: window['env']['homeURL'] || 'http://localhost:4200/home',
  },
  defaultLanguage: window['env']['defaultLanguage'] || 'en-US',
  supportedLanguages: window['env']['supportedLanguages'] || 'en-US,fr-FR',
  headOfficeID: window['env']['headOfficeID'] || '1',
  //Matomo instance config
  matomoSiteId: window['env']['matomoSiteId'] || 1,
  matomoSiteUrl: window['env']['matomoSiteUrl'] || 'https://analytics.integration.oneacrefund.org',
  // Loan submission button disabled timeout in seconds
  loanSubmitButtonDisabledTimeOut: window['env']['loanSubmitButtonDisabledTimeOut'] || 5,
  sentryDsn: window['env']['sentryDsn'] || 'https://test@o454511.ingest.us.sentry.io/test',
};

// Server URL
environment.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}${environment.apiVersion}`;
//environment.oauth.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}`;
