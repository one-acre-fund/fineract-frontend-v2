import env from './.env';

//Code for common environment variables
const appName = 'fineract-ui';
export const commonEnvironments = {
    appName: appName,
    appDisplayName:  'Fineract',
    version: env.mifos_x.version,
    hash: env.mifos_x.hash,
    footerContent: 'Fineract UI by One Acre Fund',
    apm: {
      serviceName: appName,
      serverUrl: window['env']['apmServerUrl'] || 'http://apm-server-apm-server.elk:8200'
    }
  };