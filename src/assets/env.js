(function (window) {
  window["env"] = window["env"] || {};

  // BackEnd Environment variables
  window["env"]["fineractApiUrls"] = 'https://localhost:8443';
  window["env"]["fineractApiUrl"]  = 'https://localhost:8443';

  window["env"]["authServerUrl"] = "";

  window["env"]["apiProvider"] = "/fineract-provider/api";
  window["env"]["apiVersion"] = "/v1";

  window["env"]["fineractPlatformTenantId"] = "";

  window['env']['keycloakRealm'] = "";
  window['env']['keycloakClientId'] = "";
  window["env"]["fineractPlatformTenantId"]  = 'default';

  // Language Environment variables
  window["env"]["defaultLanguage"] = "";
  window["env"]["supportedLanguages"] = "";
  // Head Office ID
  window["env"]["headOfficeID"] = "";
})(this);
