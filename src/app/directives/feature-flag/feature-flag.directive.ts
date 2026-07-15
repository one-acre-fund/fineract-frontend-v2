/** Angular Imports */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/** Custom Services */
import { FeatureFlagsService } from '../../core/feature-flags/feature-flags.service';

/**
 * Feature Flag Directive.
 *
 * Usage:
 * <ng-container *mifosxFeatureFlag="'clients.kyc-v2'">
 *   Visible only when clients.kyc-v2=true
 * </ng-container>
 */
@Directive({
  selector: '[mifosxFeatureFlag]'
})
export class FeatureFlagDirective {

  /**
   * @param {TemplateRef} templateRef Template Reference.
   * @param {ViewContainerRef} viewContainer View Container Reference.
   * @param {FeatureFlagsService} featureFlagsService Feature flags service.
   */
  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private featureFlagsService: FeatureFlagsService) { }

  /**
   * Evaluates the flag and renders the template only when enabled.
   */
  @Input()
  set mifosxFeatureFlag(flagName: any) {
    if (typeof flagName !== 'string') {
      throw new Error('featureFlag value must be a string');
    }

    // Clear before rendering to avoid duplicated embedded views on change detection.
    this.viewContainer.clear();

    if (this.featureFlagsService.isEnabled(flagName)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}

