/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { OrganizationComponent } from './organization.component';
import { LoanProvisioningCriteriaComponent } from './loan-provisioning-criteria/loan-provisioning-criteria.component';
import { OfficesComponent } from './offices/offices.component';
import { EmployeesComponent } from './employees/employees.component';
import { CreateEmployeeComponent } from './employees/create-employee/create-employee.component';
import { ViewEmployeeComponent } from './employees/view-employee/view-employee.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { SmsCampaignsComponent } from './sms-campaigns/sms-campaigns.component';
import { AdhocQueryComponent } from './adhoc-query/adhoc-query.component';
import { ViewAdhocQueryComponent } from './adhoc-query/view-adhoc-query/view-adhoc-query.component';
import { TellersComponent } from './tellers/tellers.component';
import { ViewTellerComponent } from './tellers/view-teller/view-teller.component';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { EditPaymentTypeComponent } from './payment-types/edit-payment-type/edit-payment-type.component';
import { PasswordPreferencesComponent } from './password-preferences/password-preferences.component';
import { EntityDataTableChecksComponent } from './entity-data-table-checks/entity-data-table-checks.component';
import { WorkingDaysComponent } from './working-days/working-days.component';
import { CreateOfficeComponent } from './offices/create-office/create-office.component';
import { CreatePaymentTypeComponent } from './payment-types/create-payment-type/create-payment-type.component';
import { CreateAdhocQueryComponent } from './adhoc-query/create-adhoc-query/create-adhoc-query.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { EditEmployeeComponent } from './employees/edit-employee/edit-employee.component';
import { CreateTellerComponent } from './tellers/create-teller/create-teller.component';
import { EditTellerComponent } from './tellers/edit-teller/edit-teller.component';
import { ViewCashierComponent } from './tellers/cashiers/view-cashier/view-cashier.component';
import { ViewHolidaysComponent } from './holidays/view-holidays/view-holidays.component';
import { ViewOfficeComponent } from './offices/view-office/view-office.component';
import { GeneralTabComponent } from './offices/view-office/general-tab/general-tab.component';
import { DatatableTabsComponent } from './offices/view-office/datatable-tabs/datatable-tabs.component';
import { ViewCampaignComponent } from './sms-campaigns/view-campaign/view-campaign.component';
import { ManageFundsComponent } from './manage-funds/manage-funds.component';
import { ManageCurrenciesComponent } from './currencies/manage-currencies/manage-currencies.component';
import { CashiersComponent } from './tellers/cashiers/cashiers.component';
import { TransactionsComponent } from './tellers/cashiers/transactions/transactions.component';
import { AllocateCashComponent } from './tellers/cashiers/allocate-cash/allocate-cash.component';
import { SettleCashComponent } from './tellers/cashiers/settle-cash/settle-cash.component';
import { EditCashierComponent } from './tellers/cashiers/edit-cashier/edit-cashier.component';
import { CreateCashierComponent } from './tellers/cashiers/create-cashier/create-cashier.component';
import { EditHolidayComponent } from './holidays/edit-holiday/edit-holiday.component';
import { EditAdhocQueryComponent } from './adhoc-query/edit-adhoc-query/edit-adhoc-query.component';
import { EditOfficeComponent } from './offices/edit-office/edit-office.component';
import { BulkImportComponent } from './bulk-import/bulk-import.component';
import { ViewBulkImportComponent } from './bulk-import/view-bulk-import/view-bulk-import.component';
import { ViewLoanProvisioningCriteriaComponent } from './loan-provisioning-criteria/view-loan-provisioning-criteria/view-loan-provisioning-criteria.component';
import { CreateCampaignComponent } from './sms-campaigns/create-campaign/create-campaign.component';
import { EditCampaignComponent } from './sms-campaigns/edit-campaign/edit-campaign.component';
import { CreateEnityDataTableChecksComponent } from './entity-data-table-checks/create-enity-data-table-checks/create-enity-data-table-checks.component';
import { CreateLoanProvisioningCriteriaComponent } from './loan-provisioning-criteria/create-loan-provisioning-criteria/create-loan-provisioning-criteria.component';
import { BulkLoanReassignmnetComponent } from './bulk-loan-reassignmnet/bulk-loan-reassignmnet.component';
import { EditLoanProvisioningCriteriaComponent } from './loan-provisioning-criteria/edit-loan-provisioning-criteria/edit-loan-provisioning-criteria.component';
import { StandingInstructionsHistoryComponent } from './standing-instructions-history/standing-instructions-history.component';
import { FundMappingComponent } from './fund-mapping/fund-mapping.component';
import { CreateHolidayComponent } from './holidays/create-holiday/create-holiday.component';

/** Custom Resolvers */
import { LoanProvisioningCriteriaResolver } from './loan-provisioning-criteria/common-resolvers/loan-provisioning-criteria.resolver';
import { OfficesResolver } from './offices/common-resolvers/offices.resolver';
import { EmployeesResolver } from './employees/employees.resolver';
import { EmployeeResolver } from './employees/employee.resolver';
import { EditEmployeeResolver } from './employees/edit-employee.resolver';
import { CurrenciesResolver } from './currencies/currencies.resolver';
import { SmsCampaignsResolver } from './sms-campaigns/common-resolvers/sms-campaigns.resolver';
import { AdhocQueriesResolver } from './adhoc-query/common-resolvers/adhoc-queries.resolver';
import { AdhocQueryResolver } from './adhoc-query/common-resolvers/adhoc-query.resolver';
import { TellersResolver } from './tellers/common-resolvers/tellers.resolver';
import { TellerResolver } from './tellers/common-resolvers/teller.resolver';
import { PaymentTypesResolver } from './payment-types/payment-types.resolver';
import { PaymentTypeResolver } from './payment-types/payment-type.resolver';
import { PasswordPreferencesTemplateResolver } from './password-preferences/password-preferences-template.resolver';
import { EntityDataTableChecksResolver } from './entity-data-table-checks/entity-data-table-checks.resolver';
import { WorkingDaysResolver } from './working-days/working-days.resolver';
import { EditOfficeResolver } from './offices/common-resolvers/edit-office.resolver';
import { AdhocQueryTemplateResolver } from './adhoc-query/adhoc-query-template.resolver';
import { LoanProvisioningCriteriasResolver } from './loan-provisioning-criteria/common-resolvers/loan-provisioning-criterias.resolver';
import { CashierResolver } from './tellers/common-resolvers/cashier.resolver';
import { CashiersResolver } from './tellers/common-resolvers/cashiers.resolver';
import { HolidayResolver } from './holidays/holiday.resolver';
import { OfficeResolver } from './offices/common-resolvers/office.resolver';
import { OfficeDatatableResolver } from './offices/common-resolvers/office-datatable.resolver';
import { OfficeDatatablesResolver } from './offices/common-resolvers/office-datatables.resolver';
import { SmsCampaignResolver } from './sms-campaigns/common-resolvers/sms-campaign.resolver';
import { ManageFundsResolver } from './manage-funds/manage-funds.resolver';
import { CashierTransactionTemplateResolver } from './tellers/common-resolvers/teller-transaction-template.resolver';
import { EditCashierResolver } from './tellers/common-resolvers/edit-cashier.resolver';
import { HolidayTemplateResolver } from './holidays/holiday-template.resolver';
import { AdhocQueryAndTemplateResolver } from './adhoc-query/common-resolvers/adhoc-query-and-template.resolver';
import { BulkImportResolver } from './bulk-import/bulk-import.resolver';
import { SmsCampaignTemplateResolver } from './sms-campaigns/common-resolvers/sms-campaign-template.resolver';
import { EntityDataTableChecksTemplateResolver } from './entity-data-table-checks/enitity-data-table-checks-template.resolver';
import { LoanProvisioningCriteriaTemplateResolver } from './loan-provisioning-criteria/common-resolvers/loan-provisioning-criteria-template.resolver';
import { LoanProvisioningCriteriaAndTemplateResolver } from './loan-provisioning-criteria/common-resolvers/loan-provisioning-criteria-and-template.resolver';
import { StandingInstructionsTemplateResolver } from './standing-instructions-history/standing-instructions-template.resolver';
import { AdvanceSearchTemplateResolver } from './fund-mapping/advance-search-template.resolver';
import { CombineOfficeComponent } from './offices/combine-office/combine-office.component';
import { SplitOfficeComponent } from './offices/split-office/split-office.component';
import { RetailOutletResolver } from './rural-outlet/retail-outlet.resolver';
import { ViewOutletComponent } from './rural-outlet/view-outlet/view-outlet.component';
import { RuralOutletComponent } from './rural-outlet/rural-outlet.component';
import { EditOutletComponent } from './rural-outlet/edit-outlet/edit-outlet.component';
import { CreateOutletComponent } from './rural-outlet/create-outlet/create-outlet.component';
import { EditRetailOutletResolver } from './rural-outlet/edit-retail-outlet.resolver';
import { CreateCurrenciesComponent } from './currencies/create-currencies/create-currencies.component';
import { BulkRepaymentDownloadComponent } from './bulk-import/bulk-repayment-download/bulk-repayment-download.component';

/** Organization Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'organization',
      data: { title: extract('Organization'), breadcrumb: 'Organization' },
      children: [
        {
          path: '',
          component: OrganizationComponent
        },
        {
          path: 'provisioning-criteria',
          data: { title: extract('Provisioning Criteria'), breadcrumb: 'Provisioning Criteria' },
          children: [
            {
              path: '',
              component: LoanProvisioningCriteriaComponent,
              resolve: {
                loanProvisioningCriterias: LoanProvisioningCriteriasResolver
              }
            },
            {
              path: 'create',
              data: { title: extract('Create Provisioning Criteria'), breadcrumb: 'Create Provisioning Criteria' },
              component: CreateLoanProvisioningCriteriaComponent,
              resolve: {
                loanProvisioningCriteriaTemplate: LoanProvisioningCriteriaTemplateResolver,
              }
            },
            {
              path: ':id',
              data: { title: extract('View Provisioning Criteria'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewLoanProvisioningCriteriaComponent,
                  resolve: {
                    loanProvisioningCriteria: LoanProvisioningCriteriaResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditLoanProvisioningCriteriaComponent,
                  data: { title: extract('Edit Provisioning Criteria'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    loanProvisioningCriteriaAndTemplate: LoanProvisioningCriteriaAndTemplateResolver
                  }
                }
              ]
            }
          ],
        },
        {
          path: 'offices',
          data: { title: extract('Manage Offices'), breadcrumb: 'Manage Offices' },
          children: [
            {
              path: '',
              component: OfficesComponent,
              resolve: {
              offices: OfficesResolver
              }
            },
            {
              path: 'create',
              component: CreateOfficeComponent,
              data: { title: extract('Create Office'), breadcrumb: 'Create Office' },
              resolve: {
                offices: OfficesResolver,
              }
            },
            {
              path: 'combine',
              component: CombineOfficeComponent,
              data: { title: extract('Combine Office'), breadcrumb: 'Combine Office' },
              resolve: {
                offices: OfficesResolver,
              }
            },
            {
              path: 'split',
              component: SplitOfficeComponent,
              data: { title: extract('Split Office'), breadcrumb: 'Split Office' },
              resolve: {
                offices: OfficesResolver,
              }
            },
            {
              path: ':id',
              data: { title: extract('View Office'), routeResolveBreadcrumb: ['office', 'name'] },
              component: ViewOfficeComponent,
              resolve: {
                 officeDatatables: OfficeDatatablesResolver,
                 office: OfficeResolver
              },
              children: [
                {
                  path: 'general',
                  component: GeneralTabComponent,
                  data: { title: extract('General') },
                },
                {
                  path: 'datatables',
                  children: [
                    {
                      path: ':datatableName',
                      component: DatatableTabsComponent,
                      data: { title: extract('View Data Table') },
                      resolve: {
                        officeDatatable: OfficeDatatableResolver
                      }
                    }
                  ]
                }
              ]
            },
            {
              path: ':id',
              data: { title: extract('View Office'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: 'edit',
                  component: EditOfficeComponent,
                  data: { title: extract('Edit Office'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    officeTemplate: EditOfficeResolver
                  }
                }
              ]
            }

          ]
        },
        {
          path: 'rural-outlet',
          data: { title: extract('Rural Retail Outlet'), breadcrumb: 'Manage Rural Retail Outlet' },
          children: [
            {
              path: '',
              component: RuralOutletComponent,
              resolve: {
                offices: RetailOutletResolver
              }
            },
            {
              path: 'create',
              component: CreateOutletComponent,
              data: { title: extract('Create Outlet'), breadcrumb: 'Create Outlet' },
              resolve: {
                offices: RetailOutletResolver
              }
            },
            {
              path: ':id',
              data: { title: extract('View Rural Outlet'), routeParamBreadcrumb: 'id', routeResolveBreadcrumb: ['offices', 'name'] },
              component: ViewOutletComponent,
              resolve: {
                offices: EditRetailOutletResolver
              }
            },
            {
              path: ':id',
              data: { title: extract('View Rural Outlet'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: 'edit',
                  data: { title: extract('Edit Rural Outlet'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  component: EditOutletComponent,
                  resolve: {
                     offices: RetailOutletResolver
                  }
                }
              ]
            }
          ],
        },
        {
          path: 'employees',
          data: { title: extract('Manage Employees'), breadcrumb: 'Manage Employees' },
          children: [
            {
              path: '',
              component: EmployeesComponent,
              resolve: {
                employees: EmployeesResolver
              }
            },
            {
              path: 'create',
              component: CreateEmployeeComponent,
              data: { title: extract('Create Employee'), breadcrumb: 'Create Employee' },
              resolve: {
                offices: OfficesResolver
              }
            },
            {
              path: ':id',
              data: { title: extract('View Employee'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewEmployeeComponent,
                  resolve: {
                    employee: EmployeeResolver,
                  }
                },
                {
                  path: 'edit',
                  component: EditEmployeeComponent,
                  data: { title: extract('Edit Employee'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    employee: EditEmployeeResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'currencies',
          data: { title: extract('Currency Configuration'), breadcrumb: 'Currency Configuration' },
          children: [
            {
              path: '',
              component: CurrenciesComponent,
              resolve: {
                currencies: CurrenciesResolver
              }
            },
            {
              path: 'manage',
              data: { title: extract('Manage Currencies'), breadcrumb: 'Manage Currencies' },
              component: ManageCurrenciesComponent
            },
            {
              path: 'create',
              component: CreateCurrenciesComponent,
              data: { title: extract('Create Currency'), breadcrumb: 'Create Currency' },
              resolve: {
                currencies: CurrenciesResolver
              }
            }
          ]
        },
        {
          path: 'sms-campaigns',
          data: { title: extract('SMS Campaigns'), breadcrumb: 'SMS Campaigns' },
          children: [
            {
              path: '',
              component: SmsCampaignsComponent,
              resolve: {
                smsCampaigns: SmsCampaignsResolver
              }
            },
            {
              path: 'create',
              data: { title: extract('Create SMS Campaign'), breadcrumb: 'Create Campaign' },
              component: CreateCampaignComponent,
              resolve: {
                smsCampaignTemplate: SmsCampaignTemplateResolver
              }
            },
            {
              path: ':id',
              data: { title: extract('View SMS Campaign'), routeResolveBreadcrumb: ['smsCampaign', 'campaignName'] },
              resolve: {
                smsCampaign: SmsCampaignResolver
              },
              runGuardsAndResolvers: 'always',
              children: [
                {
                  path: '',
                  component: ViewCampaignComponent,
                },
                {
                  path: 'edit',
                  component: EditCampaignComponent,
                  data: { title: extract('Edit SMS Campaign'), breadcrumb: 'Edit', routeResolveBreadcrumb: false},
                  resolve: {
                    smsCampaignTemplate: SmsCampaignTemplateResolver,
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'standing-instructions-history',
          component: StandingInstructionsHistoryComponent,
          data: { title: extract('Standing Instructions History'), breadcrumb: 'Standing Instructions History' },
          resolve: {
            standingInstructionsTemplate: StandingInstructionsTemplateResolver
          }
        },
        {
          path: 'fund-mapping',
          component: FundMappingComponent,
          data: { title: extract('Advance Search'), breadcrumb: 'Advance Search' },
          resolve: {
            advanceSearchTemplate: AdvanceSearchTemplateResolver
          }
        },
        {
          path: 'adhoc-query',
          data: { title: extract('Adhoc Query'), breadcrumb: 'Adhoc Query' },
          children: [
            {
              path: '',
              component: AdhocQueryComponent,
              resolve: {
                adhocQueries: AdhocQueriesResolver
              }
            },
            {
              path: 'create',
              component: CreateAdhocQueryComponent,
              data: { title: extract('Create Adhoc Query'), breadcrumb: 'Create' },
              resolve: {
                adhocQueryTemplate: AdhocQueryTemplateResolver
              }
            },
            {
              path: ':id',
              data: { title: extract('View Adhoc Query'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewAdhocQueryComponent,
                  resolve: {
                    adhocQuery: AdhocQueryResolver
                  },
                },
                {
                  path: 'edit',
                  component: EditAdhocQueryComponent,
                  data: { title: extract('Edit Adhoc Query'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    adhocQueryAndTemplate: AdhocQueryAndTemplateResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'tellers',
          data: { title: extract('Tellers'), breadcrumb: 'Tellers' },
          children: [
            {
              path: '',
              component: TellersComponent,
              resolve: {
                tellers: TellersResolver
              }
            },
            {
              path: 'create',
              component: CreateTellerComponent,
              data: { title: extract('Create Teller'), breadcrumb: 'Create' },
              resolve: {
                offices: OfficesResolver
              }
            },
            {
              path: ':id',
              data: { title: extract('View Teller'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewTellerComponent,
                  resolve: {
                    teller: TellerResolver
                  },
                },
                {
                  path: 'edit',
                  component: EditTellerComponent,
                  data: { title: extract('Edit Teller'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    teller: TellerResolver,
                    offices: OfficesResolver
                  }
                },
                {
                  path: 'cashiers',
                  data: { title: extract('Cashiers'), breadcrumb: 'Cashiers', routeParamBreadcrumb: false },
                  children: [
                    {
                      path: '',
                      component: CashiersComponent,
                      resolve: {
                        cashiersData: CashiersResolver
                      }
                    },
                    {
                      path: 'create',
                      data: { title: extract('Cashiers'), breadcrumb: 'Create Cashier' },
                      component: CreateCashierComponent,
                      resolve: {
                        cashierTemplate: EditCashierResolver
                      }
                    },
                    {
                      path: ':id',
                      data: { title: extract('View Cashier'),  routeParamBreadcrumb: 'id' },
                      children: [
                        {
                          path: '',
                          component: ViewCashierComponent,
                          data: { title: extract('View Cashier'), breadcrumb: 'View Cashier', routeParamBreadcrumb: false },
                          resolve: {
                            cashier: CashierResolver
                          }
                        },
                        {
                          path: 'edit',
                          component: EditCashierComponent,
                          data: { title: extract('Edit Cashier'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                          resolve: {
                            cashier: CashierResolver,
                            cashierTemplate: EditCashierResolver
                          }
                        },
                        {
                          path: 'transactions',
                          data: { title: extract('Cashier Transactions'), breadcrumb: 'Transactions', routeParamBreadcrumb: false },
                          component: TransactionsComponent,
                          resolve: {
                            currencies: CurrenciesResolver
                          }
                        },
                        {
                          path: 'settle',
                          component: SettleCashComponent,
                          data: { title: extract('Settle Cash'), breadcrumb: 'Settle Cash', routeParamBreadcrumb: false },
                          resolve: {
                            cashierTemplate: CashierTransactionTemplateResolver
                          }
                        },
                        {
                          path: 'allocate',
                          component: AllocateCashComponent,
                          data: { title: extract('Allocate Cash'), breadcrumb: 'Allocate Cash', routeParamBreadcrumb: false },
                          resolve: {
                            cashierTemplate: CashierTransactionTemplateResolver
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: 'payment-types',
          data: { title: extract('Payment Types'), breadcrumb: 'Payment Types' },
          children: [
            {
              path: '',
              component: PaymentTypesComponent,
              resolve: {
                paymentTypes: PaymentTypesResolver
              }
            },
            {
              path: 'create',
              component: CreatePaymentTypeComponent,
              data: { title: extract('Create Payment Type'), breadcrumb: 'Create Payment Type'}
            },
            {
              path: ':id',
              data: { routeParamBreadcrumb: 'id', addBreadcrumbLink: false },
              children: [
                {
                  path: 'edit',
                  component: EditPaymentTypeComponent,
                  data: { title: extract('Edit Payment Type'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    paymentType: PaymentTypeResolver
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'password-preferences',
          component: PasswordPreferencesComponent,
          data: { title: extract('Password Preferences'), breadcrumb: 'Password Preferences' },
          resolve: {
            passwordPreferencesTemplate: PasswordPreferencesTemplateResolver
          }
        },
        {
          path: 'bulkloan',
          component: BulkLoanReassignmnetComponent,
          data: { title: extract('Bulk Loan Reassignment'), breadcrumb: 'Bulk Loan Reasssignment' },
          resolve: {
            offices: OfficesResolver
          }
        },
        {
          path: 'entity-data-table-checks',
          data: { title: extract('Entity Data Table Checks'), breadcrumb: 'Entity Data Table Checks' },
          children: [
            {
              path: '',
              component: EntityDataTableChecksComponent,
              resolve: {
                entityDataTableChecks: EntityDataTableChecksResolver
              },
            },
            {
              path: 'create',
              component: CreateEnityDataTableChecksComponent,
              data: { title: extract('Create Entity Data Table Checks'), breadcrumb: 'Create' },
              resolve: {
                dataTableEntity: EntityDataTableChecksTemplateResolver
              }
            }
          ]
        },
        {
          path: 'working-days',
          component: WorkingDaysComponent,
          data: { title: extract('Working Days'), breadcrumb: 'Working Days' },
          resolve: {
            workingDays: WorkingDaysResolver
          }
        },
        {
          path: 'manage-funds',
          component: ManageFundsComponent,
          data: { title: extract('Manage Funds Days'), breadcrumb: 'Manage Funds' },
          resolve: {
            funds: ManageFundsResolver
          }
        },
        {
          path: 'bulk-import',
          data: { title: extract('Bulk Import'), breadcrumb: 'Bulk Import' },
          children: [
            {
              path: '',
              component: BulkImportComponent,
            },
            {
              path: 'repayments-download',
              data: { title: extract('Repayments Download'), breadcrumb: 'Repayments Download' },
              children: [
                {
                  path: '',
                  component: BulkRepaymentDownloadComponent,
                }
              ]
            },
            {
              path: ':import-name',
              component: ViewBulkImportComponent,
              data: { title: extract('View Bulk Import'), routeParamBreadcrumb: 'import-name' },
            },
          ]
        },
        {
          path: 'holidays',
          data: { title: extract('Manage Holidays'), breadcrumb: 'Manage Holidays' },
          children: [
            {
              path: '',
              component: HolidaysComponent,
              resolve: {
                offices: OfficesResolver
              }
            },
            {
              path: 'create',
              component: CreateHolidayComponent,
              data: { title: extract('Create Holiday'), breadcrumb: 'Create' },
              resolve: {
                offices: OfficesResolver,
                holidayTemplate: HolidayTemplateResolver
              }
            },
            {
              path: ':id',
              data: { title: extract('View Holidays'), routeParamBreadcrumb: 'id' },
              children: [
                {
                  path: '',
                  component: ViewHolidaysComponent,
                  resolve: {
                    holidays: HolidayResolver
                  }
                },
                {
                  path: 'edit',
                  component: EditHolidayComponent,
                  data: { title: extract('Edit Holidays'), breadcrumb: 'Edit', routeParamBreadcrumb: false },
                  resolve: {
                    holiday: HolidayResolver,
                    holidayTemplate: HolidayTemplateResolver
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ])
];

/**
 * Organization Routing Module
 *
 * Configures the organization routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    LoanProvisioningCriteriaResolver,
    OfficesResolver,
    EmployeesResolver,
    EmployeeResolver,
    EditEmployeeResolver,
    CurrenciesResolver,
    SmsCampaignsResolver,
    SmsCampaignResolver,
    SmsCampaignTemplateResolver,
    AdhocQueriesResolver,
    AdhocQueryResolver,
    TellersResolver,
    TellerResolver,
    PaymentTypesResolver,
    PaymentTypeResolver,
    PasswordPreferencesTemplateResolver,
    EntityDataTableChecksResolver,
    WorkingDaysResolver,
    EditOfficeResolver,
    AdhocQueryTemplateResolver,
    AdhocQueryAndTemplateResolver,
    LoanProvisioningCriteriasResolver,
    CashierResolver,
    CashiersResolver,
    HolidayResolver,
    OfficeResolver,
    OfficeDatatableResolver,
    OfficeDatatablesResolver,
    ManageFundsResolver,
    CashierTransactionTemplateResolver,
    EditCashierResolver,
    HolidayResolver,
    HolidayTemplateResolver,
    BulkImportResolver,
    HolidayResolver,
    EntityDataTableChecksTemplateResolver,
    LoanProvisioningCriteriasResolver,
    LoanProvisioningCriteriaTemplateResolver,
    LoanProvisioningCriteriaAndTemplateResolver,
    StandingInstructionsTemplateResolver,
    AdvanceSearchTemplateResolver
  ]
})
export class OrganizationRoutingModule { }
