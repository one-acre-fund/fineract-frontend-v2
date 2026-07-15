/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeatureFlagDemoComponent } from './feature-flag-demo/feature-flag-demo.component';

/** Feature Flag Imports */
import { FeatureFlagGuard } from '../core/feature-flags/feature-flag.guard';
import { FEATURE_FLAG_CLIENTS_KYC_V2 } from '../core/feature-flags/feature-flags.model';

/** Custom Resolvers */
import { OfficesResolver } from '../accounting/common-resolvers/offices.resolver';

/** Home and Dashboard Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      component: HomeComponent,
      data: { title: extract('labels.text.Home') }
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      data: { title: extract('labels.text.Dashboard'), breadcrumb: 'Dashboard' },
      resolve: {
        offices: OfficesResolver
      }
    },
    {
      path: 'feature-flags/clients-kyc-v2-demo',
      component: FeatureFlagDemoComponent,
      canActivate: [FeatureFlagGuard],
      data: {
        title: extract('labels.text.Clients KYC V2 Feature Flag Demo'),
        breadcrumb: 'Clients KYC V2 Feature Flag Demo',
        featureFlag: FEATURE_FLAG_CLIENTS_KYC_V2
      }
    }
  ])
];

/**
 * Home Routing Module
 *
 * Configures the home and dashboard routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [OfficesResolver]
})
export class HomeRoutingModule { }
