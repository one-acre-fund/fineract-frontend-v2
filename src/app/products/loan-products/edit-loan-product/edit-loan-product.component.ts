/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Components */
import { LoanProductDetailsStepComponent } from '../loan-product-stepper/loan-product-details-step/loan-product-details-step.component';
import { LoanProductTermsStepComponent } from '../loan-product-stepper/loan-product-terms-step/loan-product-terms-step.component';
import { LoanProductSettingsStepComponent } from '../loan-product-stepper/loan-product-settings-step/loan-product-settings-step.component';
import { LoanProductChargesStepComponent } from '../loan-product-stepper/loan-product-charges-step/loan-product-charges-step.component';
import { LoanProductAccountingStepComponent } from '../loan-product-stepper/loan-product-accounting-step/loan-product-accounting-step.component';
import { LoanProductOrganizationUnitStepComponent } from '../loan-product-stepper/loan-product-organization-unit-step/loan-product-organization-unit-step.component';
import { LoanProductClientEligibilityStepComponent } from '../loan-product-stepper/loan-product-client-eligibility-step/loan-product-client-eligibility-step.component';
import { LoanProductAppsComponent } from '../loan-product-stepper/loan-product-apps/loan-product-apps.component';

/** Custom Services */
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';
import { LoanProductQualificationRulesStepComponent } from '../loan-product-stepper/loan-product-qualification-rules-step/loan-product-qualification-rules-step.component';
import { LoanProductDownPaymentStepComponent } from '../loan-product-stepper/loan-product-down-payment-step/loan-product-down-payment-step.component';

@Component({
  selector: 'mifosx-edit-loan-product',
  templateUrl: './edit-loan-product.component.html',
  styleUrls: ['./edit-loan-product.component.scss']
})
export class EditLoanProductComponent implements OnInit {

  @ViewChild(LoanProductDetailsStepComponent, { static: true }) loanProductDetailsStep: LoanProductDetailsStepComponent;
  @ViewChild(LoanProductTermsStepComponent, { static: true }) loanProductTermsStep: LoanProductTermsStepComponent;
  @ViewChild(LoanProductSettingsStepComponent, { static: true }) loanProductSettingsStep: LoanProductSettingsStepComponent;
  @ViewChild(LoanProductChargesStepComponent, { static: true }) loanProductChargesStep: LoanProductChargesStepComponent;
  @ViewChild(LoanProductAccountingStepComponent, { static: true }) loanProductAccountingStep: LoanProductAccountingStepComponent;
  @ViewChild(LoanProductOrganizationUnitStepComponent, { static: true }) loanProductOrganizationStep: LoanProductOrganizationUnitStepComponent;
  @ViewChild(LoanProductClientEligibilityStepComponent, { static: true }) loanProductClientEligibilityStep: LoanProductClientEligibilityStepComponent;
  @ViewChild(LoanProductAppsComponent, { static: true }) loanProductAppsStep: LoanProductAppsComponent;
  @ViewChild(LoanProductQualificationRulesStepComponent, { static: false }) loanProductQualificationRulesStep: LoanProductQualificationRulesStepComponent;
  @ViewChild(LoanProductDownPaymentStepComponent, { static: false }) loanProductDownPaymentStep: LoanProductDownPaymentStepComponent;

  loanProductAndTemplate: any;
  accountingRuleData = ['None', 'Cash', 'Accrual (periodic)', 'Accrual (upfront)'];
  isQualificationRequired: boolean = false;
  isCreditScoringEnabled: boolean = false;
  enableTermsAndConditions: boolean = false;
  

  /**
   * @param {ActivatedRoute} route Activated Route.
   * @param {ProductsService} productsService Product Service.
   * @param {SettingsService} settingsService Settings Service
   * @param {Router} router Router for navigation.
   */

  constructor(private route: ActivatedRoute,
              private productsService: ProductsService,
              private settingsService: SettingsService,
              private router: Router) {
    this.route.data.subscribe((data: { loanProductAndTemplate: any }) => {
      this.loanProductAndTemplate = data.loanProductAndTemplate;
      // the shared country belongs to whichever product is open: one left behind by an earlier editor would have the
      // steps that read it load another country's offices and charges
      this.productsService.countryId = this.loanProductAndTemplate.countryId;
      this.isQualificationRequired = this.loanProductAndTemplate.configurations?.isQualificationRequired;
      this.enableTermsAndConditions = this.loanProductAndTemplate.configurations?.enableTermsAndConditions;
      this.isCreditScoringEnabled = this.loanProductAndTemplate.configurations?.isCreditScoringEnabled;
      // this.addTermsAndConditions = this.loanProductAndTemplate.settings?.loanProductTemplate != null || this.loanProductAndTemplate.settings?.loanProductTemplate != undefined;
    });
  }

  ngOnInit() {
  }

  get loanProductDetailsForm() {
    return this.loanProductDetailsStep.loanProductDetailsForm;
  }

  get loanProductTermsForm() {
    return this.loanProductTermsStep.loanProductTermsForm;
  }

  get loanProductSettingsForm() {
    return this.loanProductSettingsStep.loanProductSettingsForm;
  }

  get loanProductAccountingForm() {
    return this.loanProductAccountingStep.loanProductAccountingForm;
  }

  get loanProductOrganizationForm() {
    return this.loanProductOrganizationStep.loanProductOrganizationForm;
  }

  get loanProductClientEligibilityForm() {
    return this.loanProductClientEligibilityStep?.loanProductClientEligibilityForm;
  }

  get loanProductAppsForm() {
    return this.loanProductAppsStep?.loanProductAppsForm;
  }

  get loanProductQualificationRuleForm() {
    return this.loanProductQualificationRulesStep?.loanProductQualificationRuleForm;
  }

  get loanProductDownPaymentForm() {
    return this.loanProductDownPaymentStep?.loanProductDownPaymentForm;
  }

  /** The down payment step is only reachable for a product that takes a down payment by configuration */
  get isDownPaymentConfigured() {
    return this.loanProductTermsStep.isDownPaymentConfigured;
  }

  get loanProductFormValidAndNotPristine() {
    return (
      this.loanProductDetailsForm.valid &&
      this.loanProductOrganizationForm.valid &&
      this.loanProductAppsForm.valid &&
      this.loanProductTermsForm.valid &&
      this.loanProductSettingsForm.valid &&
      this.loanProductAccountingForm.valid &&
      this.loanProductClientEligibilityForm.valid &&
      (!this.isDownPaymentConfigured || this.loanProductDownPaymentForm?.valid) &&
      (
        !this.loanProductDetailsForm.pristine ||
        !this.loanProductTermsForm.pristine ||
        !this.loanProductSettingsForm.pristine ||
        !this.loanProductChargesStep.pristine ||
        !this.loanProductAccountingForm.pristine ||
        !this.loanProductOrganizationForm.pristine ||
        !this.loanProductClientEligibilityForm.pristine ||
        !this.loanProductAppsForm.pristine ||
        this.loanProductDownPaymentStep?.pristine === false
      )
    );
  }

  get loanProductTemplateForm() {
    return this.loanProductOrganizationStep.loanProductTemplateForm;
  }

  get loanProduct() {
    return {
      ...this.loanProductDetailsStep.loanProductDetails,
      ...this.loanProductOrganizationStep.loanProductOrganization,
      ...this.loanProductTermsStep.loanProductTerms,
      ...this.loanProductSettingsStep.loanProductSettings,
      ...this.loanProductChargesStep.loanProductCharges,
      ...this.loanProductAccountingStep.loanProductAccounting,
      ...this.loanProductClientEligibilityStep.loanProductClientEligibility,
      ...this.loanProductAppsStep.loanProductApps,
      ...this.loanProductQualificationRulesStep?.loanProductQualificationRule,
      ...this.loanProductDownPaymentStep?.loanProductDownPayment,
      ...this.downPaymentConfigurationsLeftBehind
    };
  }

  /**
   * A product that stops taking a down payment has to send its saved configurations back marked for deletion: the API
   * keeps the ones a request does not mention, and refuses configurations without the CONFIGURED strategy. The down
   * payment step is gone by then, so the ids come from the product itself.
   */
  private get downPaymentConfigurationsLeftBehind() {
    if (this.isDownPaymentConfigured) {
      return {};
    }
    const saved = this.loanProductAndTemplate.downPaymentConfigurations || [];
    return saved.length === 0
      ? {}
      : { downPaymentConfigurations: saved.map((configuration: any) => ({ id: configuration.id, markedForDeletion: true })) };
  }

  submit() {
    // TODO: Update once language and date settings are setup
    const dateFormat = this.settingsService.dateFormat;
    const loanProduct = {
      ...this.loanProduct,
      charges: this.loanProduct.charges.map((charge: any) => ({ id: charge.id })),
      dateFormat,
      locale: this.settingsService.language.code,
      terms : {
        repaymentStartPeriod: this.loanProduct.repaymentStartPeriod, repaymentStartPeriodFrequencyType: this.loanProduct.repaymentStartPeriodFrequencyType,
      },
    };
    if(loanProduct.templateForTermsAndConditions == undefined || loanProduct.templateForTermsAndConditions == null || loanProduct.templateForTermsAndConditions == ""){
      delete loanProduct.templateForTermsAndConditions;
    }
    delete loanProduct.allowAttributeConfiguration;
    delete loanProduct.advancedAccountingRules;
    delete loanProduct.repaymentStartPeriod;
    delete loanProduct.repaymentStartPeriodFrequencyType;
    delete loanProduct.showTermsAndConditions;
    this.productsService.updateLoanProduct(this.loanProductAndTemplate.id, loanProduct)
      .subscribe((response: any) => {
        this.router.navigate(['../../', response.resourceId], { relativeTo: this.route });
      });
  }


}
