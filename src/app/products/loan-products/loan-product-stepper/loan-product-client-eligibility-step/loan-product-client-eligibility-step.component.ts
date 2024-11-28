import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'app/products/products.service';

@Component({
  selector: 'mifosx-loan-product-client-eligibility-step',
  templateUrl: './loan-product-client-eligibility-step.component.html',
  styleUrls: ['./loan-product-client-eligibility-step.component.scss'],
})
export class LoanProductClientEligibilityStepComponent implements OnInit {
  @Input() loanProductsTemplate: any;
  @Input() loanProduct: any;

  amountCalculationTypeOptions: any;
  loanProductClientEligibilityForm: UntypedFormGroup;

  loanTypeId: any;

  constructor( private formBuilder: UntypedFormBuilder, private router: Router, private productService: ProductsService ) {
    this.productService.loanTypeId.subscribe(val => {
      this.loanTypeId = val;
    });
  }

  ngOnInit(): void {

    this.loanTypeId = this.productService.loanTypeId;

    this.createloanProductClientEligibilityForm();
    this.amountCalculationTypeOptions = this.loanProductsTemplate.amountCalculationTypeOptions;
    if ( this.router.url.includes('edit') ) {
      this.loanProductClientEligibilityForm.patchValue({
        previouslyTakenInput: this.loanProductsTemplate.clientEligibility.previouslyTakenInput,
        previouslyNotTakenInput: this.loanProductsTemplate.clientEligibility?.previouslyNotTakenInput,
        previouslyTakenCredit: this.loanProductsTemplate.clientEligibility?.previouslyTakenCredit,
        previouslyNotTakenCredit: this.loanProductsTemplate.clientEligibility?.previouslyNotTakenCredit,
        previouslyDefaultedFrom: this.loanProductsTemplate.clientEligibility?.previouslyDefaultedFrom,
        previouslyDefaultedTo: this.loanProductsTemplate.clientEligibility?.previouslyDefaultedTo,
        minimumCreditRepaid: this.loanProductsTemplate.clientEligibility?.minimumCreditRepaid,
        minimumCreditRepaidType: this.loanProductsTemplate.clientEligibility?.minimumCreditRepaidType,
        clientGroupPreviouslyDefaulted: this.loanProductsTemplate.clientEligibility?.clientGroupPreviouslyDefaulted,
        clientGroupPreviouslyNotDefaulted: this.loanProductsTemplate.clientEligibility?.clientGroupPreviouslyNotDefaulted,
        minimumGroupCreditRepaid: this.loanProductsTemplate.clientEligibility?.minimumGroupCreditRepaid,
        minimumGroupCreditRepaidType: this.loanProductsTemplate.clientEligibility?.minimumGroupCreditRepaidType
      });
    }
  }

  createloanProductClientEligibilityForm() {
      this.loanProductClientEligibilityForm = this.formBuilder.group({
        previouslyTakenInput: null,
        previouslyNotTakenInput: null,
        previouslyTakenCredit: null,
        previouslyNotTakenCredit: null,
        previouslyDefaultedFrom: [null],
        previouslyDefaultedTo: [null],
        minimumCreditRepaid: [''],
        minimumCreditRepaidType: [''],
        clientGroupPreviouslyDefaulted: null,
        clientGroupPreviouslyNotDefaulted: null,
        minimumGroupCreditRepaid: [''],
        minimumGroupCreditRepaidType: ['']
      }, { validators: this.previouslyDefaultedValidator });

    }

  get loanProductClientEligibility() {
    const loanProductClientEligibilityFormData = {};
    for (const key in this.loanProductClientEligibilityForm?.value) {
      const value = this.loanProductClientEligibilityForm.value[key]
      if (value !== undefined && value !== null && value !== '') {
        loanProductClientEligibilityFormData[key] = value;
      }
    }

    return { clientEligibility: loanProductClientEligibilityFormData };
  }

  /**
   * Validates the previously defaulted from and to values. It ensures that both values are either provided or not provided at all.
   * @param control AbstractControl containing the previously defaulted from and to values.
   * @returns ValidationErrors if the values are invalid, otherwise null.
   */
  previouslyDefaultedValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const fromValueExists = this.valueExists(control.get('previouslyDefaultedFrom'));
    const toValueExists = this.valueExists(control.get('previouslyDefaultedTo'));
    if ((fromValueExists && !toValueExists) || (!fromValueExists && toValueExists)) {
      return { previouslyDefaultedInvalid: true };
    }
    return null;
  };

  /**
   * Checks if the control has a value.
   * @param control AbstractControl containing the value to check.
   * @returns True if the control has a value, otherwise false.
   */
  private valueExists(control: AbstractControl): boolean {
    return control && control.value !== null && control.value !== undefined;
  }
}
