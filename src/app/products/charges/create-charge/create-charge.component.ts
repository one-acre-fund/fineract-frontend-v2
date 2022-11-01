/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom Services */
import { ProductsService } from '../../products.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

/**
 * Create charge component.
 */
@Component({
  selector: 'mifosx-create-charge',
  templateUrl: './create-charge.component.html',
  styleUrls: ['./create-charge.component.scss']
})
export class CreateChargeComponent implements OnInit {
  /** Selected Data. */
  chargeData: any;
  /** Charge form. */
  chargeForm: FormGroup;
  /** Charges template data. */
  chargesTemplateData: any;
  /** Charge time type data. */
  chargeTimeTypeData: any;
  /** Charge calculation type data. */
  chargeCalculationTypeData: any = '';
  /** Income and liability account data */
  incomeAndLiabilityAccountData: any;
  /** Minimum due date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum due date allowed. */
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  /** Repeat every label */
  repeatEveryLabel: string;
  /** Currency decimal places */
  currencyDecimalPlaces: number;
  /** Show Penalty. */
  showPenalty = false;

  countries: any = [];
  countriesDataSliced: any = [];
  isAddingCharge = false;
  chargeTimeTypeOptions: any;
  /** Charge Calculation Type options. */
  chargeCalculationTypeOptions: any;
  /** Show GL Accounts. */
  showGLAccount = false;

  /**
   * Retrieves the charges template data and income and liability account data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ProductsService} productsService Products Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {Dates} dateUtils Date Utils to format date.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor (
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: Dates,
    private settingsService: SettingsService
  ) {
    this.route.data.subscribe((data: { chargesTemplate: any }) => {
      this.chargesTemplateData = data.chargesTemplate;
    });
    this.getCountries();
  }

  /**
   * Creates and sets the charge form.
   */
  ngOnInit () {
    this.createChargeForm();
  }

  /**
   * Creates the charge form.
   */
  createChargeForm () {
    if ( this.router.url.includes ( 'edit' ) ) {
      this.isAddingCharge = false;
      this.chargeForm = this.formBuilder.group({
        name: [this.chargesTemplateData.name, Validators.required],
        active: [this.chargesTemplateData.active],
        penalty: [this.chargesTemplateData.penalty, Validators.required],
        currencyCode: [this.chargesTemplateData.currency.code, Validators.required],
        chargeAppliesTo: [{ value: this.chargesTemplateData.chargeAppliesTo.id, disabled: true }, Validators.required],
        amount: [this.chargesTemplateData.amount, Validators.required],
        country: [{ value: this.chargesTemplateData.countryId, disabled: true }, Validators.required],
        chargeTimeType: [this.chargesTemplateData.chargeTimeType.id, Validators.required],
        chargeCalculationType: [this.chargesTemplateData.chargeCalculationType.id, Validators.required]
      });
      switch (this.chargesTemplateData.chargeAppliesTo.value) {
        case 'Loan': {
          this.chargeTimeTypeOptions = this.chargesTemplateData.loanChargeTimeTypeOptions;
          this.chargeCalculationTypeOptions = this.chargesTemplateData.loanChargeCalculationTypeOptions;
          break;
        }
        case 'Savings': {
          this.chargeTimeTypeOptions = this.chargesTemplateData.savingsChargeTimeTypeOptions;
          this.chargeCalculationTypeOptions = this.chargesTemplateData.savingsChargeCalculationTypeOptions;
          break;
        }

        default: {
          this.chargeCalculationTypeOptions = this.chargesTemplateData.clientChargeCalculationTypeOptions;
          this.chargeTimeTypeOptions = this.chargesTemplateData.clientChargeTimeTypeOptions;
          this.showGLAccount = true;
          this.chargeForm.addControl(
            'incomeAccountId',
            this.formBuilder.control(this.chargesTemplateData.incomeOrLiabilityAccount.id, Validators.required)
          );
          break;
        }
      }
      switch (this.chargesTemplateData.chargeTimeType.value) {
        case 'Disbursement': {
          this.showPenalty = false;
          break;
        }
        case 'Overdue Fees': {
          this.showPenalty = true;
          break;
        }
        default: {
          this.showPenalty = false;
          break;
        }
      }
    } else {
      this.isAddingCharge = true;
      this.chargeForm = this.formBuilder.group({
        country: ['', Validators.required],
        chargeAppliesTo: [1],
        name: ['', Validators.required],
        currencyCode: ['', Validators.required],
        chargeTimeType: ['', Validators.required],
        chargeCalculationType: ['', Validators.required],
        amount: ['', Validators.required],
        active: [false],
        penalty: [true, Validators.required]
      });
    }
  }

  /**
   * Submits the charge form and creates charge,
   * if successful redirects to charges.
   */
  submit () {
    if ( this.router.url.includes ( 'edit' ) ) {
      const charges = this.chargeForm.getRawValue();
      charges.locale = this.settingsService.language.code;
      if (this.showPenalty) {
        charges.penalty = true;
      } else {
        charges.penalty = false;
      }
      this.productsService.updateCharge(this.chargesTemplateData.id.toString(), charges).subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    } else {
      const chargeFormData = this.chargeForm.value;
      const locale = this.settingsService.language.code;
      const prevFeeOnMonthDay: Date = this.chargeForm.value.feeOnMonthDay;
      const monthDayFormat = 'dd MMM';
      if (chargeFormData.feeOnMonthDay instanceof Date) {
        chargeFormData.feeOnMonthDay = this.dateUtils.formatDate(prevFeeOnMonthDay, monthDayFormat);
      }
      const data = {
        ...chargeFormData,
        monthDayFormat,
        locale
      };
      delete data.addFeeFrequency;
      if (!data.taxGroupId) {
        delete data.taxGroupId;
      }
      if (!data.minCap) {
        delete data.minCap;
      }
      if (!data.maxCap) {
        delete data.maxCap;
      }
      if (this.showPenalty) {
        data.penalty = true;
      } else {
        data.penalty = false;
      }
      this.productsService.createCharge(data).subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

  getCountries () {
    this.productsService.getCountries().subscribe((response: any) => {
      this.countries = response;
      this.countriesDataSliced = response;
    });
  }

  isFiltered (country: any) {
    return this.countriesDataSliced.find(item => item.id === country.id);
  }
  showHidepenalty (event: any) {
    if (event.value !== 1) {
      this.showPenalty = true;
      this.chargeForm.controls['penalty'].setValidators(Validators.required);
      this.chargeForm.controls['penalty'].updateValueAndValidity();
    } else {
      this.showPenalty = false;
      this.chargeForm.controls['penalty'].clearValidators();
      this.chargeForm.controls['penalty'].updateValueAndValidity();
    }
  }

}
