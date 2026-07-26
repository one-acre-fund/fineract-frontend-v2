import { TemplateRef, ViewContainerRef } from '@angular/core';

import { FeatureFlagDirective } from './feature-flag.directive';
import { FeatureFlagsService } from '../../core/feature-flags/feature-flags.service';
import { FEATURE_FLAG_CLIENTS_KYC_V2 } from '../../core/feature-flags/feature-flags.model';

describe('FeatureFlagDirective', () => {
  let templateRef: TemplateRef<any>;
  let viewContainer: jasmine.SpyObj<ViewContainerRef>;
  let featureFlagsService: jasmine.SpyObj<FeatureFlagsService>;

  beforeEach(() => {
    templateRef = {} as TemplateRef<any>;
    viewContainer = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createEmbeddedView']);
    featureFlagsService = jasmine.createSpyObj('FeatureFlagsService', ['isEnabled']);
  });

  it('should render the template when the feature flag is enabled', () => {
    featureFlagsService.isEnabled.and.returnValue(true);
    const directive = new FeatureFlagDirective(templateRef, viewContainer, featureFlagsService);

    directive.mifosxFeatureFlag = FEATURE_FLAG_CLIENTS_KYC_V2;

    expect(viewContainer.clear).toHaveBeenCalled();
    expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
  });

  it('should not render the template when the feature flag is disabled', () => {
    featureFlagsService.isEnabled.and.returnValue(false);
    const directive = new FeatureFlagDirective(templateRef, viewContainer, featureFlagsService);

    directive.mifosxFeatureFlag = FEATURE_FLAG_CLIENTS_KYC_V2;

    expect(viewContainer.clear).toHaveBeenCalled();
    expect(viewContainer.createEmbeddedView).not.toHaveBeenCalled();
  });
});

