/** Angular Imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

/** Custom Services */
import { FeatureFlagsService } from './feature-flags.service';

/**
 * Feature Flag Guard.
 *
 * Blocks direct URL access to routes for disabled features. This should be used
 * together with menu/template hiding so both normal navigation and copied URLs
 * respect the same flag.
 */
@Injectable()
export class FeatureFlagGuard implements CanActivate {

  /**
   * @param {Router} router Router for redirects.
   * @param {FeatureFlagsService} featureFlagsService Feature flags service.
   */
  constructor(private router: Router, private featureFlagsService: FeatureFlagsService) { }

  /**
   * Allows route access only when every required feature flag is enabled.
   * Route usage: data: { featureFlag: 'clients.kyc-v2' }
   */
  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredFlags = this.getRequiredFlags(route.data ? route.data.featureFlag : null);

    if (!requiredFlags.length || requiredFlags.every((flagName: string) => this.featureFlagsService.isEnabled(flagName))) {
      return true;
    }

    return this.router.createUrlTree(['/home'], {
      queryParams: {
        featureFlagUnavailable: requiredFlags.join(',')
      }
    });
  }

  private getRequiredFlags(featureFlag: string | string[]): string[] {
    if (Array.isArray(featureFlag)) {
      return featureFlag.filter((flagName: string) => !!flagName);
    }

    return featureFlag ? [featureFlag] : [];
  }

}

