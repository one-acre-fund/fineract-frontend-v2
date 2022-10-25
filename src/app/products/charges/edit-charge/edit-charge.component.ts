/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';


/**
 * Edit Charge component.
 */
@Component({
  selector: 'mifosx-edit-charge',
  templateUrl: './edit-charge.component.html',
  styleUrls: ['./edit-charge.component.scss']
})
export class EditChargeComponent implements OnInit {

  /** Selected Data. */
  chargeData: any;
  /** Charge form. */
  editChargeForm: FormGroup;
  /** Select Income. */
  selectedIncome: any;
  /** Select Time Type. */
  selectedTime: any;
  /** Select Currency Type. */
  selectedCurrency: any;
  /** Select Calculation Type. */
  selectedCalculation: any;
  /** Charge Time Type options. */
  chargeTimeTypeOptions: any;
  /** Charge Calculation Type options. */
  chargeCalculationTypeOptions: any;
  /** Show Penalty. */
  showPenalty = true;
  /** Show GL Accounts. */
  showGLAccount = false;
  /** Show Fee Options. */
  showFeeOptions = false;

  countries: any = [];
  countriesDataSliced: any = [];

  /**
   * Retrieves the charge data from `resolve`.
   * @param {ProductsService} productsService Products Service.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(private productsService: ProductsService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { chargesTemplate: any }) => {
      this.chargeData = data.chargesTemplate;
      this.getCountries();
    });
  }

  ngOnInit() {

    this.createEditChargeForm();
  }

  /**
   * Edit Charge form.
   */
  createEditChargeForm() {
    this.editChargeForm = this.formBuilder.group({
      'country': [{value: this.chargeData.countryId, disabled: true}, Validators.required],
      'name': [this.chargeData.name, Validators.required],
      'chargeAppliesTo': [{ value: this.chargeData.chargeAppliesTo.id, disabled: true }, Validators.required],
      'currencyCode': [this.chargeData.currency.code, Validators.required],
      'amount': [this.chargeData.amount, Validators.required],
      'active': [this.chargeData.active],
      'penalty': [this.chargeData.penalty],
      'chargeTimeType': [this.chargeData.chargeTimeType.id, Validators.required],
      'chargeCalculationType': [this.chargeData.chargeCalculationType.id, Validators.required],
    });
    switch (this.chargeData.chargeAppliesTo.value) {
      case 'Loan': {
        this.chargeTimeTypeOptions = this.chargeData.loanChargeTimeTypeOptions;
        this.chargeCalculationTypeOptions = this.chargeData.loanChargeCalculationTypeOptions;
        break;
      }
      case 'Savings': {
        this.chargeTimeTypeOptions = this.chargeData.savingsChargeTimeTypeOptions;
        this.chargeCalculationTypeOptions = this.chargeData.savingsChargeCalculationTypeOptions;
        break;
      }

      default: {
        this.chargeCalculationTypeOptions = this.chargeData.clientChargeCalculationTypeOptions;
        this.chargeTimeTypeOptions = this.chargeData.clientChargeTimeTypeOptions;
        this.showGLAccount = true;
        this.editChargeForm.addControl('incomeAccountId', this.formBuilder.control(this.chargeData.incomeOrLiabilityAccount.id, Validators.required));
        break;
      }
    }
    switch (this.chargeData.chargeTimeType.value) {
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
  }

  /**
   * Submits Edit Charge form.
   */
  submit() {
    const charges = this.editChargeForm.value;
    charges.locale = this.settingsService.language.code;
    charges.chargePaymentMode = this.chargeData.chargePaymentMode.id;
    this.productsService.updateCharge(this.chargeData.id.toString(), charges)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

  /**
   * get list of countries
   */

  getCountries() {
      this.productsService.getCountries().subscribe((response: any) => {
          this.countries = response;
          this.countriesDataSliced = response;
      });
  }

  public isFiltered(country: any) {
    return this.countriesDataSliced.find(item => item.id === country.id);
  }
}
