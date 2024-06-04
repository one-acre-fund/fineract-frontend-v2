// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: true,
  version: env.mifos_x.version,
  hash: env.mifos_x.hash,
  // For connecting to server running elsewhere update the tenant identifier
  fineractPlatformTenantId: window['env']['fineractPlatformTenantId'] || 'default',
  // For connecting to others servers running elsewhere update the base API URL
  baseApiUrls:
    window['env']['fineractApiUrls'] ||
    'https://dev.mifos.io,https://demo.mifos.io,https://qa.mifos.io,https://staging.mifos.io,https://mobile.mifos.io,https://loans.oneacrefund.org,https://localhost:8443',
  // For connecting to server running elsewhere set the base API URL
  baseApiUrl: window['env']['baseApiUrl'] || 'https://loans.oneacrefund.org',
  allowServerSwitch: env.allow_switching_backend_instance,
  apiProvider: window['env']['apiProvider'] || '/fineract-provider/api',
  apiVersion: window['env']['apiVersion'] || '/v1',
  serverUrl: '',
  oauth: {
    enabled: true, // For connecting to Mifos X using OAuth2 Authentication change the value to true
    serverUrl: window['env']['authServerUrl'] || 'https://accounts.oneacrefund.org',
    realm: 'OneAcreFund',
    client_id: 'fineract',
    tokenUrl: `https://loans.oneacrefund.org/auth/realms/OneAcreFund/protocol/openid-connect/token`,
    redirectUri: window['env']['homeURL'] || 'http://localhost:4200/home',
  },
  defaultLanguage: window['env']['defaultLanguage'] || 'en-US',
  supportedLanguages: window['env']['supportedLanguages'] || 'en-US,fr-FR',
  headOfficeID: window['env']['headOfficeID'] || '1',
};

// Server URL
environment.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}${environment.apiVersion}`;
//environment.oauth.serverUrl = `${environment.baseApiUrl}${environment.apiProvider}`;
