import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'app/products/products.service';

@Component({
  selector: 'mifosx-loan-product-qualification-rules-step',
  templateUrl: './loan-product-qualification-rules-step.component.html',
  styleUrls: ['./loan-product-qualification-rules-step.component.scss']
})
export class LoanProductQualificationRulesStepComponent implements OnInit {
  @Input() loanProductsTemplate: any;
  @Input() loanProduct: any;
  loanTypeId: any;
  repaymentFrequencyTypeOptions: any;
  /** Shown read only here, as the down payment step holds them: its live summary, not the saved product's */
  @Input() downPaymentConfigurations: any[] = [];

  loanProductQualificationRuleForm: UntypedFormGroup;

  constructor(private productService: ProductsService, private formBuilder: UntypedFormBuilder, private router: Router) {
    this.productService.loanTypeId.subscribe(val => {
      this.loanTypeId = val;
    });
   }

  ngOnInit(): void {
    this.createloanProductClientEligibilityForm();
    this.repaymentFrequencyTypeOptions = this.loanProductsTemplate.repaymentFrequencyTypeOptions;
    if ( this.router.url.includes('edit') ) {
      this.setLoanProductClientEligibilityFormForEdit();
    }
  }
  


  get loanProductQualificationRule() {
    return { qualificationRules:  this.loanProductQualificationRuleForm.value };
  }

  createloanProductClientEligibilityForm() {
    this.loanProductQualificationRuleForm = this.formBuilder.group({
      minimumQualifiedMembers: null,
      newJoinerWindowsAfterQualification: null,
      newJoinerWindowsAfterQualificationFrequency: null,
      orderPickupWindowsAfterQualification: null,
      orderPickupWindowsAfterQualificationFrequency: null,
    });

  }

  setLoanProductClientEligibilityFormForEdit() {
    this.loanProductQualificationRuleForm.patchValue({
      minimumQualifiedMembers: this.loanProductsTemplate.qualificationRules?.minimumQualifiedMembers,
      newJoinerWindowsAfterQualification: this.loanProductsTemplate.qualificationRules?.newJoinerWindowsAfterQualification,
      newJoinerWindowsAfterQualificationFrequency: this.loanProductsTemplate.qualificationRules?.newJoinerWindowsAfterQualificationFrequency?.id,
      orderPickupWindowsAfterQualification: this.loanProductsTemplate.qualificationRules?.orderPickupWindowsAfterQualification,
      orderPickupWindowsAfterQualificationFrequency: this.loanProductsTemplate.qualificationRules?.orderPickupWindowsAfterQualificationFrequency?.id,
    });
  }
}
