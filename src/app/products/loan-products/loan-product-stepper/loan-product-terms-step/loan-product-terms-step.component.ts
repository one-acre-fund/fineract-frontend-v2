import { Component, OnInit, Input, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';

import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import {
  DOWN_PAYMENT_STRATEGY_CONFIGURED,
  DOWN_PAYMENT_STRATEGY_NONE,
} from '../../down-payment/down-payment-configuration.models';

@Component({
  selector: 'mifosx-loan-product-terms-step',
  templateUrl: './loan-product-terms-step.component.html',
  styleUrls: ['./loan-product-terms-step.component.scss']
})
export class LoanProductTermsStepComponent implements OnInit {

  @Input() loanProductsTemplate: any;

  loanProductTermsForm: UntypedFormGroup;

  valueConditionTypeData: any;
  floatingRateData: any;
  interestRateFrequencyTypeData: any;
  repaymentFrequencyTypeData: any;
  loanEndDateOverrideModeOptions: any;
  repaymentFrequencyTypeOptions: any;
  pristine = true;

  downPaymentQualificationStrategies: any[] = [];
  /** The strategy is only asked for in a country whose loans need the client to qualify by paying a down payment */
  showDownPaymentStrategy = false;
  private savedDownPaymentStrategy: string;
  private savedCountryRequiresQualification = false;
  private hasSavedDownPaymentConfigurations = false;
  private settingDownPaymentStrategy = false;

  displayedColumns: string[] = ['valueConditionType', 'borrowerCycleNumber', 'minValue', 'defaultValue', 'maxValue', 'actions'];

  constructor(private formBuilder: UntypedFormBuilder,
              public dialog: MatDialog, private productService: ProductsService, 
              private dateUtils: Dates, private settingsService: SettingsService) {
    this.createLoanProductTermsForm();
    this.setConditionalControls();
  }

  ngOnInit() {
    this.downPaymentQualificationStrategies = this.loanProductsTemplate.downPaymentQualificationStrategyOptions;
    this.valueConditionTypeData = this.loanProductsTemplate.valueConditionTypeOptions;
    this.floatingRateData = this.loanProductsTemplate.floatingRateOptions;
    this.interestRateFrequencyTypeData = this.loanProductsTemplate.interestRateFrequencyTypeOptions;
    this.repaymentFrequencyTypeData = this.loanProductsTemplate.repaymentFrequencyTypeOptions;
    this.repaymentFrequencyTypeOptions = this.loanProductsTemplate.repaymentFrequencyTypeOptions;
    this.loanEndDateOverrideModeOptions = this.loanProductsTemplate.loanEndDateOverrideModeOptions;

    this.loanProductTermsForm.patchValue({
      'minPrincipal': this.loanProductsTemplate.minPrincipal,
      'principal': this.loanProductsTemplate.principal,
      'maxPrincipal': this.loanProductsTemplate.maxPrincipal,
      'minNumberOfRepayments': this.loanProductsTemplate.minNumberOfRepayments,
      'numberOfRepayments': this.loanProductsTemplate.numberOfRepayments,
      'maxNumberOfRepayments': this.loanProductsTemplate.maxNumberOfRepayments,
      'isLinkedToFloatingInterestRates': this.loanProductsTemplate.isLinkedToFloatingInterestRates,
      'minInterestRatePerPeriod': this.loanProductsTemplate.minInterestRatePerPeriod,
      'interestRatePerPeriod': 0,
      'maxInterestRatePerPeriod': this.loanProductsTemplate.maxInterestRatePerPeriod,
      'interestRateFrequencyType': this.loanProductsTemplate.interestRateFrequencyType.id,
      'floatingRatesId': this.loanProductsTemplate.floatingRateId,
      'interestRateDifferential': this.loanProductsTemplate.interestRateDifferential,
      'isFloatingInterestRateCalculationAllowed': this.loanProductsTemplate.isFloatingInterestRateCalculationAllowed,
      'minDifferentialLendingRate': this.loanProductsTemplate.minDifferentialLendingRate,
      'defaultDifferentialLendingRate': this.loanProductsTemplate.defaultDifferentialLendingRate,
      'maxDifferentialLendingRate': this.loanProductsTemplate.maxDifferentialLendingRate,
      'useBorrowerCycle': this.loanProductsTemplate.useBorrowerCycle,
      'repaymentEvery': this.loanProductsTemplate.repaymentEvery,
      'repaymentFrequencyType': this.loanProductsTemplate.repaymentFrequencyType.id,
      'minimumDaysBetweenDisbursalAndFirstRepayment': this.loanProductsTemplate.minimumDaysBetweenDisbursalAndFirstRepayment,
      'loanEndDateOverrideMode': this.loanProductsTemplate.loanEndDateOverrideMode,
      'loanEndDateOverrideEndDate': this.loanProductsTemplate.loanEndDateOverrideEndDate  && new Date(this.loanProductsTemplate.loanEndDateOverrideEndDate),
      'repaymentStartPeriod': this.loanProductsTemplate.terms?.repaymentStartPeriod,
      'repaymentStartPeriodFrequencyType': this.loanProductsTemplate.terms?.repaymentStartPeriodFrequencyType?.id,
      'downPaymentStrategy': this.loanProductsTemplate.terms?.downPaymentQualificationStrategy?.code,
    });

    this.loanProductTermsForm.setControl('principalVariationsForBorrowerCycle',
      this.formBuilder.array(this.loanProductsTemplate.principalVariationsForBorrowerCycle.map((variation: any) => ({ ...variation, valueConditionType: variation.valueConditionType.id }))));
    this.loanProductTermsForm.setControl('numberOfRepaymentVariationsForBorrowerCycle',
      this.formBuilder.array(this.loanProductsTemplate.numberOfRepaymentVariationsForBorrowerCycle.map((variation: any) => ({ ...variation, valueConditionType: variation.valueConditionType.id }))));
    this.loanProductTermsForm.setControl('interestRateVariationsForBorrowerCycle',
      this.formBuilder.array(this.loanProductsTemplate.interestRateVariationsForBorrowerCycle.map((variation: any) => ({ ...variation, valueConditionType: variation.valueConditionType.id }))));

    this.savedDownPaymentStrategy = this.loanProductsTemplate.terms?.downPaymentQualificationStrategy?.code;
    // a saved product carries its country's own configuration, which the organisation unit step only reports later
    this.savedCountryRequiresQualification = !!this.loanProductsTemplate.id
      && !!this.loanProductsTemplate.configurations?.isQualificationRequired;
    this.hasSavedDownPaymentConfigurations = (this.loanProductsTemplate.downPaymentConfigurations || []).length > 0;
    this.productService.isQualificationRequired.subscribe((isQualificationRequired: boolean) => {
      this.applyDownPaymentStrategyVisibility(isQualificationRequired);
    });
    this.loanProductTermsForm.get('downPaymentStrategy').valueChanges.subscribe((strategy: string) => {
      this.onDownPaymentStrategyChange(strategy);
    });

    this.publishPrincipalRange();
    this.loanProductTermsForm.get('minPrincipal').valueChanges.subscribe(() => this.publishPrincipalRange());
    this.loanProductTermsForm.get('maxPrincipal').valueChanges.subscribe(() => this.publishPrincipalRange());
  }

  get isDownPaymentConfigured(): boolean {
    return this.showDownPaymentStrategy
      && this.loanProductTermsForm.get('downPaymentStrategy').value === DOWN_PAYMENT_STRATEGY_CONFIGURED;
  }

  /**
   * Shows or hides the strategy, and only asks for it while it is shown. A product already saved with the CONFIGURED
   * strategy keeps the field even where its country no longer requires qualification, so that editing it cannot
   * silently throw its configurations away.
   *
   * The value itself is left alone while the field is hidden: the country's configuration arrives after the product
   * is loaded, so clearing it here would drop the strategy the product was saved with and leave the field empty and
   * required once the country turns out to need it. A hidden field is reported as NONE by loanProductTerms, and the
   * down payment step follows the field rather than the value, so nothing of it reaches the request meanwhile.
   *
   * A saved product's own country decides the field from the first paint, so editing one does not show the step
   * appearing a moment later; the field then stays, even if the country is changed to one that asks for nothing,
   * so that the strategy is given up deliberately rather than quietly.
   */
  private applyDownPaymentStrategyVisibility(isQualificationRequired: boolean): void {
    this.showDownPaymentStrategy = !!isQualificationRequired || this.savedCountryRequiresQualification
      || this.savedDownPaymentStrategy === DOWN_PAYMENT_STRATEGY_CONFIGURED;
    const strategy = this.loanProductTermsForm.get('downPaymentStrategy');
    if (this.showDownPaymentStrategy) {
      strategy.setValidators(Validators.required);
    } else {
      strategy.clearValidators();
    }
    strategy.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Leaving the CONFIGURED strategy deletes the configurations the product has, so it is worth a confirmation. The
   * strategy goes back to CONFIGURED before the question is asked and only moves once it is answered: letting the
   * change stand would take the down payment step off the stepper, and the configurations being edited are held by
   * that step, so cancelling would hand back the saved ones and drop the work in progress.
   */
  private onDownPaymentStrategyChange(strategy: string): void {
    if (this.settingDownPaymentStrategy) {
      return;
    }
    const losesConfigurations =
      strategy !== DOWN_PAYMENT_STRATEGY_CONFIGURED
      && this.hasSavedDownPaymentConfigurations
      && this.savedDownPaymentStrategy === DOWN_PAYMENT_STRATEGY_CONFIGURED;
    if (!losesConfigurations) {
      return;
    }
    this.setDownPaymentStrategy(DOWN_PAYMENT_STRATEGY_CONFIGURED);
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `the down payment configurations of this product` }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response?.delete) {
        this.setDownPaymentStrategy(strategy);
      }
    });
  }

  /** Sets the strategy without asking the question above again */
  private setDownPaymentStrategy(strategy: string): void {
    this.settingDownPaymentStrategy = true;
    this.loanProductTermsForm.patchValue({ downPaymentStrategy: strategy });
    this.settingDownPaymentStrategy = false;
  }

  /** The down payment bands of a CONFIGURED product must cover every principal between these limits */
  private publishPrincipalRange(): void {
    this.productService.principalRange = {
      minPrincipal: this.loanProductTermsForm.get('minPrincipal').value,
      maxPrincipal: this.loanProductTermsForm.get('maxPrincipal').value,
    };
  }

  createLoanProductTermsForm() {
    this.loanProductTermsForm = this.formBuilder.group({
      'useBorrowerCycle': [false],
      'minPrincipal': [''],
      'principal': ['', Validators.required],
      'maxPrincipal': [''],
      'minNumberOfRepayments': [''],
      'numberOfRepayments': ['', Validators.required],
      'maxNumberOfRepayments': [''],
      'isLinkedToFloatingInterestRates': [false],
      'minInterestRatePerPeriod': [''],
      'interestRatePerPeriod': ['', Validators.required],
      'maxInterestRatePerPeriod': [''],
      'interestRateFrequencyType': ['', Validators.required],
      'repaymentEvery': ['', Validators.required],
      'repaymentFrequencyType': ['', Validators.required],
      'minimumDaysBetweenDisbursalAndFirstRepayment': [''],
      'loanEndDateOverrideMode': [''],
      'loanEndDateOverrideEndDate': [''],
      'repaymentStartPeriod': [''],
      'repaymentStartPeriodFrequencyType': [''],
      'downPaymentStrategy': ['', Validators.required],
    });
  }

  setConditionalControls() {
    this.loanProductTermsForm.get('isLinkedToFloatingInterestRates').valueChanges
      .subscribe(isLinkedToFloatingInterestRates => {
        if (isLinkedToFloatingInterestRates) {
          this.loanProductTermsForm.removeControl('minInterestRatePerPeriod');
          this.loanProductTermsForm.removeControl('interestRatePerPeriod');
          this.loanProductTermsForm.removeControl('maxInterestRatePerPeriod');
          this.loanProductTermsForm.removeControl('interestRateFrequencyType');
          this.loanProductTermsForm.addControl('floatingRatesId', new UntypedFormControl('', Validators.required));
          this.loanProductTermsForm.addControl('interestRateDifferential', new UntypedFormControl('', Validators.required));
          this.loanProductTermsForm.addControl('isFloatingInterestRateCalculationAllowed', new UntypedFormControl(false));
          this.loanProductTermsForm.addControl('minDifferentialLendingRate', new UntypedFormControl('', Validators.required));
          this.loanProductTermsForm.addControl('defaultDifferentialLendingRate', new UntypedFormControl('', Validators.required));
          this.loanProductTermsForm.addControl('maxDifferentialLendingRate', new UntypedFormControl('', Validators.required));
        } else {
          this.loanProductTermsForm.addControl('minInterestRatePerPeriod', new UntypedFormControl(''));
          this.loanProductTermsForm.addControl('interestRatePerPeriod', new UntypedFormControl('', Validators.required));
          this.loanProductTermsForm.addControl('maxInterestRatePerPeriod', new UntypedFormControl(''));
          this.loanProductTermsForm.addControl('interestRateFrequencyType', new UntypedFormControl(this.interestRateFrequencyTypeData?.find(el => el.code == "interestRateFrequency.periodFrequencyType.whole_term")?.id, Validators.required));
          this.loanProductTermsForm.removeControl('floatingRatesId');
          this.loanProductTermsForm.removeControl('interestRateDifferential');
          this.loanProductTermsForm.removeControl('isFloatingInterestRateCalculationAllowed');
          this.loanProductTermsForm.removeControl('minDifferentialLendingRate');
          this.loanProductTermsForm.removeControl('defaultDifferentialLendingRate');
          this.loanProductTermsForm.removeControl('maxDifferentialLendingRate');
        }
      });

      this.loanProductTermsForm.get('useBorrowerCycle').valueChanges
        .subscribe(useBorrowerCycle => {
          if (useBorrowerCycle) {
            this.loanProductTermsForm.addControl('principalVariationsForBorrowerCycle', this.formBuilder.array([]));
            this.loanProductTermsForm.addControl('numberOfRepaymentVariationsForBorrowerCycle', this.formBuilder.array([]));
            this.loanProductTermsForm.addControl('interestRateVariationsForBorrowerCycle', this.formBuilder.array([]));
          } else {
            this.loanProductTermsForm.removeControl('principalVariationsForBorrowerCycle');
            this.loanProductTermsForm.removeControl('numberOfRepaymentVariationsForBorrowerCycle');
            this.loanProductTermsForm.removeControl('interestRateVariationsForBorrowerCycle');
          }
        });
  }

  get principalVariationsForBorrowerCycle(): UntypedFormArray {
    return this.loanProductTermsForm.get('principalVariationsForBorrowerCycle') as UntypedFormArray;
  }

  get numberOfRepaymentVariationsForBorrowerCycle(): UntypedFormArray {
    return this.loanProductTermsForm.get('numberOfRepaymentVariationsForBorrowerCycle') as UntypedFormArray;
  }

  get interestRateVariationsForBorrowerCycle(): UntypedFormArray {
    return this.loanProductTermsForm.get('interestRateVariationsForBorrowerCycle') as UntypedFormArray;
  }

  setLoanProductTermsFormDirty() {
    if (this.loanProductTermsForm.pristine) {
      this.loanProductTermsForm.markAsDirty();
    }
  }

  addVariationsForBorrowerCycle(formType: string, variationsForBorrowerCycleFormArray: UntypedFormArray) {
    const data = this.getData(formType);
    const addVariationsForBorrowerCycleDialogRef = this.dialog.open(FormDialogComponent, { data });
    addVariationsForBorrowerCycleDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        variationsForBorrowerCycleFormArray.push(response.data);
        this.setLoanProductTermsFormDirty();
      }
    });
  }

  editVariationsForBorrowerCycle(formType: string, variationsForBorrowerCycleFormArray: UntypedFormArray, index: number) {
    const data = { ...this.getData(formType, variationsForBorrowerCycleFormArray.at(index).value), layout: { addButtonText: 'Edit' } };
    const addVariationsForBorrowerCycleDialogRef = this.dialog.open(FormDialogComponent, { data });
    addVariationsForBorrowerCycleDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        variationsForBorrowerCycleFormArray.at(index).patchValue(response.data.value);
        this.setLoanProductTermsFormDirty();
      }
    });
  }

  deleteVariationsForBorrowerCycle(variationsForBorrowerCycleFormArray: UntypedFormArray, index: number) {
    const deleteVariationsForBorrowerCycleDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `this` }
    });
    deleteVariationsForBorrowerCycleDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        variationsForBorrowerCycleFormArray.removeAt(index);
        this.setLoanProductTermsFormDirty();
      }
    });
  }

  getData(formType: string, values?: any) {
    switch (formType) {
      case 'Principal': return { title: 'Principal by loan cycle', formfields: this.getFormfields(values) };
      case 'NumberOfRepayments': return { title: 'Number of repayments by loan cycle', formfields: this.getFormfields(values) };
      case 'NominalInterestRate': return { title: 'Nominal interest rate by loan cycle', formfields: this.getFormfields(values) };
    }
  }

  getFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'valueConditionType',
        label: 'Condition',
        value: values ? values.valueConditionType : this.valueConditionTypeData[0].id,
        options: { label: 'value', value: 'id', data: this.valueConditionTypeData },
        required: true,
        order: 1
      }),
      new InputBase({
        controlName: 'borrowerCycleNumber',
        label: 'Loan Cycle',
        value: values ? values.borrowerCycleNumber : undefined,
        type: 'number',
        required: true,
        order: 2
      }),
      new InputBase({
        controlName: 'minValue',
        label: 'Minimum',
        value: values ? values.minValue : undefined,
        type: 'number',
        order: 3
      }),
      new InputBase({
        controlName: 'defaultValue',
        label: 'Default',
        value: values ? values.defaultValue : undefined,
        type: 'number',
        required: true,
        order: 4
      }),
      new InputBase({
        controlName: 'maxValue',
        label: 'Maximum',
        value: values ? values.maxValue : undefined,
        type: 'number',
        order: 5
      })
    ];
    return formfields;
  }

  get loanProductTerms() {
    const loanProductTermsFormData = this.loanProductTermsForm.value;
    const prevLoanEndDateOverrideEndDate: Date = loanProductTermsFormData.loanEndDateOverrideEndDate;
    const dateFormat = this.settingsService.dateFormat;
    if (loanProductTermsFormData.loanEndDateOverrideEndDate instanceof Date) {
      loanProductTermsFormData.loanEndDateOverrideEndDate = this.dateUtils.formatDate(prevLoanEndDateOverrideEndDate, dateFormat) || '';
    }
    loanProductTermsFormData.downPaymentStrategy = this.showDownPaymentStrategy
      ? loanProductTermsFormData.downPaymentStrategy
      : DOWN_PAYMENT_STRATEGY_NONE;
    return loanProductTermsFormData;
  }
}
