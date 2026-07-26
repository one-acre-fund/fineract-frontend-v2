import { UrlTree } from '@angular/router';

import { FeatureFlagGuard } from './feature-flag.guard';
import { FeatureFlagsService } from './feature-flags.service';
import { FEATURE_FLAG_CLIENTS_KYC_V2 } from './feature-flags.model';

describe('FeatureFlagGuard', () => {
  let router: any;
  let featureFlagsService: jasmine.SpyObj<FeatureFlagsService>;
  let guard: FeatureFlagGuard;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue({} as UrlTree);
    featureFlagsService = jasmine.createSpyObj('FeatureFlagsService', ['isEnabled']);
    guard = new FeatureFlagGuard(router, featureFlagsService);
  });

  it('should allow routes without feature flag metadata', () => {
    expect(guard.canActivate({ data: {} } as any)).toBe(true);
  });

  it('should allow routes when the required flag is enabled', () => {
    featureFlagsService.isEnabled.and.returnValue(true);

    expect(guard.canActivate({ data: { featureFlag: FEATURE_FLAG_CLIENTS_KYC_V2 } } as any)).toBe(true);
  });

  it('should redirect routes when the required flag is disabled', () => {
    featureFlagsService.isEnabled.and.returnValue(false);

    expect(guard.canActivate({ data: { featureFlag: FEATURE_FLAG_CLIENTS_KYC_V2 } } as any)).toBe(router.createUrlTree.calls.mostRecent().returnValue);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home'], {
      queryParams: {
        featureFlagUnavailable: FEATURE_FLAG_CLIENTS_KYC_V2
      }
    });
  });
});

