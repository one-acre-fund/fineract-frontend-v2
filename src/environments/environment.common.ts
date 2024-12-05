import env from './.env';

//Code for common environment variables
export const commonEnvironments = {
    appName: 'fineract-ui',
    appDisplayName:  'Fineract',
    version: env.mifos_x.version,
    hash: env.mifos_x.hash,
    footerContent: 'Fineract UI by One Acre Fund'
  };