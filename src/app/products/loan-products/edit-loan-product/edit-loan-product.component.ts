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

  loanProductAndTemplate: any;
  accountingRuleData = ['None', 'Cash', 'Accrual (periodic)', 'Accrual (upfront)'];
  isQualificationRequired: boolean = false;
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
      this.isQualificationRequired = this.loanProductAndTemplate.configurations?.isQualificationRequired;
      this.enableTermsAndConditions = this.loanProductAndTemplate.configurations?.enableTermsAndConditions;
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

  get loanProductFormValidAndNotPristine() {
    return (
      this.loanProductDetailsForm.valid &&
      this.loanProductOrganizationForm.valid &&
      this.loanProductAppsForm.valid &&
      this.loanProductTermsForm.valid &&
      this.loanProductSettingsForm.valid &&
      this.loanProductAccountingForm.valid &&
      this.loanProductClientEligibilityForm.valid &&
      (
        !this.loanProductDetailsForm.pristine ||
        !this.loanProductTermsForm.pristine ||
        !this.loanProductSettingsForm.pristine ||
        !this.loanProductChargesStep.pristine ||
        !this.loanProductAccountingForm.pristine ||
        !this.loanProductOrganizationForm.pristine ||
        !this.loanProductClientEligibilityForm.pristine ||
        !this.loanProductAppsForm.pristine
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
      ...this.loanProductQualificationRulesStep?.loanProductQualificationRule
    };
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
        prepaidAmount: this.loanProduct.prepaidAmount, prepaidAmountCalculationType: this.loanProduct.prepaidAmountCalculationType,
        repaymentStartPeriod: this.loanProduct.repaymentStartPeriod, repaymentStartPeriodFrequencyType: this.loanProduct.repaymentStartPeriodFrequencyType,
      },
    };
    if(loanProduct.templateForTermsAndConditions == undefined || loanProduct.templateForTermsAndConditions == null || loanProduct.templateForTermsAndConditions == ""){
      delete loanProduct.templateForTermsAndConditions;
    }
    delete loanProduct.allowAttributeConfiguration;
    delete loanProduct.advancedAccountingRules;
    delete loanProduct.prepaidAmount;
    delete loanProduct.prepaidAmountCalculationType;
    delete loanProduct.repaymentStartPeriod;
    delete loanProduct.repaymentStartPeriodFrequencyType;
    delete loanProduct.showTermsAndConditions;
    this.productsService.updateLoanProduct(this.loanProductAndTemplate.id, loanProduct)
      .subscribe((response: any) => {
        this.router.navigate(['../../', response.resourceId], { relativeTo: this.route });
      });
  }


}
