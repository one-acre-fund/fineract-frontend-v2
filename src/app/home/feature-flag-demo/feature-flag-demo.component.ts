/** Angular Imports */
import { Component } from '@angular/core';

/** Feature Flag Imports */
import { FEATURE_FLAG_CLIENTS_KYC_V2 } from '../../core/feature-flags/feature-flags.model';

/**
 * Feature Flag Demo Component.
 *
 * This is intentionally small: it proves that code can be merged/deployed but
 * hidden until the runtime flag clients.kyc-v2 is switched on for an environment.
 */
@Component({
  selector: 'mifosx-feature-flag-demo',
  templateUrl: './feature-flag-demo.component.html',
  styleUrls: ['./feature-flag-demo.component.scss']
})
export class FeatureFlagDemoComponent {

  /** Demo flag used by the route guard and Home button. */
  readonly flagName = FEATURE_FLAG_CLIENTS_KYC_V2;

}

