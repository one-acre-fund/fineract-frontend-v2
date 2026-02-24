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
import { ProductAddQualificationPeriodComponent } from '../../custom-dialog/product-add-qualification-period/product-add-qualification-period.component';

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
  amountCalculationTypeOptions: any;
  loanEndDateOverrideModeOptions: any;
  repaymentFrequencyTypeOptions: any;
  pristine = true;

  downPaymentQualificationStrategies: any[] = [];
  productQualificationPeriodsDisplayedColumns: string[] = ['fromDate', 'toDate', 'prePaymentAmount', 'action'];
  qualificationPeriods: { periodId: number | null, fromDate: string | null, toDate: string | null, prePaymentAmount: number | null, markedForDeletion: boolean }[] = [];
  qualificationPeriodsForDisplay: { periodId: number | null, fromDate: string | null, toDate: string | null, prePaymentAmount: number | null, markedForDeletion: boolean }[] = [];


  displayedColumns: string[] = ['valueConditionType', 'borrowerCycleNumber', 'minValue', 'defaultValue', 'maxValue', 'actions'];

  constructor(private formBuilder: UntypedFormBuilder,
              public dialog: MatDialog, private productService: ProductsService, 
              private dateUtils: Dates, private settingsService: SettingsService) {
    this.createLoanProductTermsForm();
    this.setConditionalControls();
  }

  ngOnInit() {
    this.downPaymentQualificationStrategies = this.loanProductsTemplate.downPaymentQualificationStrategyOptions;
    this.qualificationPeriods = this.loanProductsTemplate.qualificationPeriods || [];
    this.qualificationPeriods = this.qualificationPeriods.map(period => ({ 
      ...period, markedForDeletion: false,
      fromDate: this.dateUtils.formatDate(period.fromDate, this.settingsService.dateFormat),
      toDate: this.dateUtils.formatDate(period.toDate, this.settingsService.dateFormat),
    }));
    this.qualificationPeriodsForDisplay = this.qualificationPeriods;
    this.valueConditionTypeData = this.loanProductsTemplate.valueConditionTypeOptions;
    this.floatingRateData = this.loanProductsTemplate.floatingRateOptions;
    this.interestRateFrequencyTypeData = this.loanProductsTemplate.interestRateFrequencyTypeOptions;
    this.repaymentFrequencyTypeData = this.loanProductsTemplate.repaymentFrequencyTypeOptions;
    this.amountCalculationTypeOptions = this.loanProductsTemplate.amountCalculationTypeOptions;
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
      'prepaidAmount': this.loanProductsTemplate.terms?.prepaidAmount,
      'prepaidAmountCalculationType': this.loanProductsTemplate.terms?.prepaidAmountCalculationType?.id,
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
      'prepaidAmount': [''],
      'prepaidAmountCalculationType': [''],
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
    if (this.qualificationPeriods.length > 0) {
      loanProductTermsFormData.qualificationPeriods = this.qualificationPeriods.map(period => ({
        ...period,
        dateFormat: dateFormat,
        locale: this.settingsService.language.code,
        fromDate: this.dateUtils.formatDate(period.fromDate, dateFormat),
        toDate: this.dateUtils.formatDate(period.toDate, dateFormat)
      }));
    }
    return loanProductTermsFormData;
  }

  prepaidAmountChange(){
    const prepaidAmount = this.loanProductTermsForm.get('prepaidAmount');
    this.productService.prepaidAmount = prepaidAmount.value ;
  }

  prepaidAmountCalculationTypeChange(amountCalculationType){
    this.productService.prepaidAmountCalculationType = amountCalculationType.value;
    
  }

  addQualificationPeriod() {
    const addQualificationPeriodDialogRef = this.dialog.open(ProductAddQualificationPeriodComponent, {
    });
    addQualificationPeriodDialogRef.afterClosed().subscribe((response: any) => {
      let dataForm = response.data;
        if (dataForm) {
          const qualificationPeriodData = {
            periodId: null,
            fromDate: this.dateUtils.formatDate(dataForm.value.fromDate, this.settingsService.dateFormat),
            toDate: this.dateUtils.formatDate(dataForm.value.toDate, this.settingsService.dateFormat),
            prePaymentAmount: dataForm.value.prePaymentAmount,
            markedForDeletion: false
          };
          this.qualificationPeriods = this.qualificationPeriods.concat(qualificationPeriodData);
          this.qualificationPeriodsForDisplay = this.qualificationPeriodsForDisplay.concat(qualificationPeriodData);
          this.pristine = false;
        }
      });
    }

    deleteQualificationPeriod(period: { periodId: number | null, fromDate: string | null, toDate: string | null, prePaymentAmount: number | null, markedForDeletion: boolean }) {
      const deleteQualificationPeriodDialogRef = this.dialog.open(DeleteDialogComponent, {
        data: { deleteContext: `qualification period` }
      });
      deleteQualificationPeriodDialogRef.afterClosed().subscribe((response: any) => {
        if (response.delete) {
          if (period) {
            period.markedForDeletion = true;
            this.qualificationPeriodsForDisplay = this.qualificationPeriodsForDisplay.filter(qp => !qp.markedForDeletion);
            if (!period.periodId) {
                this.qualificationPeriods = this.qualificationPeriods.filter(qp => qp !== period);
            }
          } 
          this.pristine = false;
        }
      });
    }

}
