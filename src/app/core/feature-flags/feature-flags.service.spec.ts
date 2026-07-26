import { FeatureFlagsService } from './feature-flags.service';
import { FEATURE_FLAG_CLIENTS_KYC_V2 } from './feature-flags.model';

describe('FeatureFlagsService', () => {
  const originalEnv = (window as any).env;

  afterEach(() => {
    (window as any).env = originalEnv;
  });

  it('should treat unknown flags as disabled', () => {
    (window as any).env = { featureFlags: '' };
    const service = new FeatureFlagsService();

    expect(service.isEnabled(FEATURE_FLAG_CLIENTS_KYC_V2)).toBe(false);
  });

  it('should parse comma-separated enabled flags', () => {
    (window as any).env = { featureFlags: 'clients.kyc-v2=true,notifications.v2=false' };
    const service = new FeatureFlagsService();

    expect(service.isEnabled(FEATURE_FLAG_CLIENTS_KYC_V2)).toBe(true);
    expect(service.isEnabled('notifications.v2')).toBe(false);
  });

  it('should parse JSON flag objects', () => {
    (window as any).env = {
      featureFlags: '{"clients.kyc-v2":{"enabled":true,"owner":"clients-team"}}'
    };
    const service = new FeatureFlagsService();

    expect(service.isEnabled(FEATURE_FLAG_CLIENTS_KYC_V2)).toBe(true);
    expect(service.getFlag(FEATURE_FLAG_CLIENTS_KYC_V2).owner).toBe('clients-team');
  });

  it('should fail closed for invalid JSON', () => {
    (window as any).env = { featureFlags: '{invalid-json' };
    const service = new FeatureFlagsService();

    expect(service.isEnabled(FEATURE_FLAG_CLIENTS_KYC_V2)).toBe(false);
  });
});

