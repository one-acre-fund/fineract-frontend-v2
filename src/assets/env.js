(function (window) {
  window['env'] = window['env'] || {};

  // BackEnd Environment variables
  window['env']['fineractApiUrls'] =
    'https://dev.mifos.io,https://demo.mifos.io,https://qa.mifos.io,https://staging.mifos.io,https://mobile.mifos.io,https://loans.test.oneacrefund.org,https://localhost:8443';
  window['env']['fineractApiUrl'] = 'https://loans.integration.oneacrefund.org';

  window['env']['authServerUrl'] = '';

  window['env']['apiProvider'] = '/fineract-provider/api';
  window['env']['apiVersion'] = '/v1';

  window['env']['fineractPlatformTenantId'] = '';

  window['env']['keycloakRealm'] = '';
  window['env']['keycloakClientId'] = '';
  window['env']['keycloakTokenUrl'] = '';

  // Language Environment variables
  window['env']['defaultLanguage'] = '';
  window['env']['supportedLanguages'] = '';
  // Head Office ID
  window['env']['headOfficeID'] = '';

  //Matomo instance config
  window['env']['matomoSiteId'] = '';
  window['env']['matomoSiteUrl'] = '';

  //Sentry integration
  window['env']['sentryDsn'] = '';
  //App name
  window['env']['appName'] = '';

  // Loan submission button disabled timeout in seconds
  window['env']['loanSubmitButtonDisabledTimeOut'] = 5;
})(this);
