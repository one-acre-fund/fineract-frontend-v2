import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

import { AccountingComponent } from './accounting.component';
import { FrequentPostingsComponent } from './frequent-postings/frequent-postings.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { CreateJournalEntryComponent } from './create-journal-entry/create-journal-entry.component';
import { SearchJournalEntryComponent } from './search-journal-entry/search-journal-entry.component';
import { FinancialActivityMappingsComponent } from './financial-activity-mappings/financial-activity-mappings.component';
import { CreateFinancialActivityMappingComponent } from './financial-activity-mappings/create-financial-activity-mapping/create-financial-activity-mapping.component';
import { ViewFinancialActivityMappingComponent } from './financial-activity-mappings/view-financial-activity-mapping/view-financial-activity-mapping.component';
import { EditFinancialActivityMappingComponent } from './financial-activity-mappings/edit-financial-activity-mapping/edit-financial-activity-mapping.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';

import { ChartOfAccountsResolver } from './chart-of-accounts/chart-of-accounts.resolver';

import { CreateGlAccountComponent } from './chart-of-accounts/create-gl-account/create-gl-account.component';
import { ViewGlAccountComponent } from './chart-of-accounts/view-gl-account/view-gl-account.component';
import { ViewGlAccountResolver } from './chart-of-accounts/view-gl-account/view-gl-account.resolver';
import { EditGlAccountComponent } from './chart-of-accounts/edit-gl-account/edit-gl-account.component';

import { ClosingEntriesComponent } from './closing-entries/closing-entries.component';
import { CreateClosureComponent } from './closing-entries/create-closure/create-closure.component';
import { ViewClosureComponent } from './closing-entries/view-closure/view-closure.component';
import { EditClosureComponent } from './closing-entries/edit-closure/edit-closure.component';
import { AccountingRulesComponent } from './accounting-rules/accounting-rules.component';
import { CreateRuleComponent } from './accounting-rules/create-rule/create-rule.component';
import { ViewRuleComponent } from './accounting-rules/view-rule/view-rule.component';
import { ViewAccountingRuleResolver } from './accounting-rules/view-rule/view-rule.resolver';
import { EditRuleComponent } from './accounting-rules/edit-rule/edit-rule.component';
import { PeriodicAccrualsComponent } from './periodic-accruals/periodic-accruals.component';
import { ProvisioningEntriesComponent } from './provisioning-entries/provisioning-entries.component';
import { CreateProvisioningEntryComponent } from './provisioning-entries/create-provisioning-entry/create-provisioning-entry.component';
import { ViewProvisioningEntryComponent } from './provisioning-entries/view-provisioning-entry/view-provisioning-entry.component';
import { ViewProvisioningJournalEntriesComponent } from './provisioning-entries/view-provisioning-journal-entries/view-provisioning-journal-entries.component';
import { MigrateOpeningBalancesComponent } from './migrate-opening-balances/migrate-opening-balances.component';

const routes: Routes = [
  Route.withShell([
    {
      path: 'accounting',
      data: { title: extract('Accounting'), breadcrumb: 'Accounting' },
      children: [
        {
          path: '',
          component: AccountingComponent
        },
        {
          path: 'frequent-postings',
          component: FrequentPostingsComponent,
          data: { title: extract('Frequent Postings'), breadcrumb: 'Frequent Postings' }
        },
        {
          path: 'transactions',
          data: { title: extract('Transactions'), breadcrumb: 'Transactions' },
          children: [
            {
              path: 'view/:id',
              component: ViewTransactionComponent,
              data: { title: extract('View Transaction'), routeParamBreadcrumb: 'id' }
            }
          ]
        },
        {
          path: 'journal-entries',
          component: SearchJournalEntryComponent,
          data: { title: extract('Search Journal Entry'), breadcrumb: 'Search Journal Entry' }
        },
        {
          path: 'journal-entries/create',
          component: CreateJournalEntryComponent,
          data: { title: extract('Create Journal Entry'), breadcrumb: 'Create Journal Entry' }
        },
        {
          path: 'financial-activity-mappings',
          data: { title: extract('Financial Activity Mappings'), breadcrumb: 'Financial Activity Mappings' },
          children: [
            {
              path: '',
              component: FinancialActivityMappingsComponent
            },
            {
              path: 'create',
              component: CreateFinancialActivityMappingComponent,
              data: { title: extract('Create Financial Activity Mapping'), breadcrumb: 'Create' },
            },
            {
              path: 'view/:id',
              data: { title: extract('View Financial Activity Mapping'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewFinancialActivityMappingComponent
                },
                {
                  path: 'edit',
                  component: EditFinancialActivityMappingComponent,
                  data: { title: extract('Edit Financial Activity Mapping'), breadcrumb: 'Edit', routeParamBreadcrumb: false }
                }
              ]
            }
          ]
        },
        {
          path: 'chart-of-accounts',
          data: { title: extract('Chart of Accounts'), breadcrumb: 'Chart of Accounts' },
          resolve: {
            glAccountData: ChartOfAccountsResolver
          },
          children: [
            {
              path: '',
              component: ChartOfAccountsComponent,
              resolve: {
                glAccountData: ChartOfAccountsResolver
              }
            },
            {
              path: 'gl-accounts/create',
              component: CreateGlAccountComponent,
              data: { title: extract('Create GL Account'), breadcrumb: 'Create GL Account' },
            },
            {
              path: 'gl-accounts/view/:id',
              data: { title: extract('View GL Account'), routeResolveBreadcrumb: ['glAccount', 'name'] },
              resolve: {
                glAccount: ViewGlAccountResolver
              },
              runGuardsAndResolvers: 'always',
              children: [
                {
                  path: '',
                  component: ViewGlAccountComponent
                },
                {
                  path: 'edit',
                  component: EditGlAccountComponent,
                  data: { title: extract('Edit GL Account'), breadcrumb: 'Edit', routeResolveBreadcrumb: false }
                }
              ]
            }
          ]
        },
        {
          path: 'closing-entries',
          data: { title: extract('Accounting Closures'), breadcrumb: 'Closing Entries' },
          children: [
            {
              path: '',
              component: ClosingEntriesComponent
            },
            {
              path: 'create',
              component: CreateClosureComponent,
              data: { title: extract('Create Accounting Closure'), breadcrumb: 'Create' }
            },
            {
              path: 'view/:id',
              data: { title: extract('View Accounting Closure'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewClosureComponent
                },
                {
                  path: 'edit',
                  component: EditClosureComponent,
                  data: { title: extract('Edit Accounting Closure'), breadcrumb: 'Edit', routeParamBreadcrumb: false }
                }
              ]
            }
          ]
        },
        {
          path: 'accounting-rules',
          data: { title: extract('Accounting Rules'), breadcrumb: 'Rules' },
          children: [
            {
              path: '',
              component: AccountingRulesComponent
            },
            {
              path: 'create',
              component: CreateRuleComponent,
              data: { title: extract('Create Accounting Rule'), breadcrumb: 'Create' }
            },
            {
              path: 'view/:id',
              data: { title: extract('View Accounting Rule'), routeResolveBreadcrumb: ['accountingRule', 'name'] },
              resolve: {
                accountingRule: ViewAccountingRuleResolver
              },
              runGuardsAndResolvers: 'always',
              children: [
                {
                  path: '',
                  component: ViewRuleComponent
                },
                {
                  path: 'edit',
                  component: EditRuleComponent,
                  data: { title: extract('Edit Accounting Rules'), breadcrumb: 'Edit', routeResolveBreadcrumb: false }
                }
              ]
            }
          ]
        },
        {
          path: 'periodic-accruals',
          component: PeriodicAccrualsComponent,
          data: { title: extract('Periodic Accrual Accounting'), breadcrumb: 'Execute Periodic Accrual Accounting' }
        },
        {
          path: 'provisioning-entries',
          data: { title: extract('Provisioning Entries'), breadcrumb: 'Provisioning Entries' },
          children: [
            {
              path: '',
              component: ProvisioningEntriesComponent
            },
            {
              path: 'create',
              component: CreateProvisioningEntryComponent,
              data: { title: extract('Create Provisioning Entry'), breadcrumb: 'Create' }
            },
            {
              path: 'view/:id',
              component: ViewProvisioningEntryComponent,
              data: { title: extract('View Provisioning Entry'), routeParamBreadcrumb: 'id' }
            },
            {
              path: 'journal-entries',
              data: { title: extract('View Provisioning Journal Entry'), breadcrumb: 'Journal Entries', addBreadcrumbLink: false },
              children: [
                {
                  path: 'view/:id',
                  component: ViewProvisioningJournalEntriesComponent,
                  data: { title: extract('View Provisioning Journal Entry'), routeParamBreadcrumb: 'id' }
                }
              ]
            }
          ]
        },
        {
          path: 'migrate-opening-balances',
          component: MigrateOpeningBalancesComponent,
          data: { title:  extract('Migrate Opening Balances'), breadcrumb: 'Migrate Opening Balances' }
        }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    ChartOfAccountsResolver,
    ViewGlAccountResolver,
    ViewAccountingRuleResolver
  ]
})
export class AccountingRoutingModule { }
