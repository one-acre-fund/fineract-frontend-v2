/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Directives */
import { HasPermissionDirective } from './has-permission/has-permission.directive';
import { FeatureFlagDirective } from './feature-flag/feature-flag.directive';

/**
 *  Directives Module
 *
 *  All custom directives should be declared and exported here.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HasPermissionDirective, FeatureFlagDirective],
  exports: [HasPermissionDirective, FeatureFlagDirective]
})
export class DirectivesModule { }
