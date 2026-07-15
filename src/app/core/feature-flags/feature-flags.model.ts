/**
 * Runtime feature flag definition.
 *
 * NOTE: These flags are public browser-side release controls. They are useful for
 * hiding or showing UI paths, but they are not a security boundary.
 */
export interface FeatureFlag {
  enabled: boolean;
  description?: string;
  owner?: string;
  expiresOn?: string;
}

/** Collection of flags by stable feature key. */
export interface FeatureFlagMap {
  [flagName: string]: FeatureFlag;
}

/** POC flag used to demo hiding/showing a merged client KYC v2 change. */
export const FEATURE_FLAG_CLIENTS_KYC_V2 = 'clients.kyc-v2';

