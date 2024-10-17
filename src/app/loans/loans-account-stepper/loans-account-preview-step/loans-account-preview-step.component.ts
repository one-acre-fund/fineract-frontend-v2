/** Angular Imports */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';

/**
 * Create Loans Account Preview Step
 */
@Component({
  selector: 'mifosx-loans-account-preview-step',
  templateUrl: './loans-account-preview-step.component.html',
  styleUrls: ['./loans-account-preview-step.component.scss']
})
export class LoansAccountPreviewStepComponent implements OnInit {

  /** Loans Account Template */
  @Input() loansAccountTemplate: any;
  /** Loans Account Product Template */
  @Input() loansAccountProductTemplate: any;
  /** Loans Account Data */
  @Input() loansAccount: any;
  /** Submit Loans Account */
  @Output() submit = new EventEmitter();

  /** Charges Displayed Columns */
  chargesDisplayedColumns: string[] = ['name', 'chargeCalculationType', 'amount', 'chargeTimeType', 'date'];
  /** Overdue Charges Displayed Columns */
  overdueChargesDisplayedColumns: string[] = ['name', 'type', 'amount', 'collectedon'];

  isLoanSubmitButtonDisabled = false

  constructor() { }

  ngOnInit() { }

  submitAndDisbleLoanSubmitButton(){
    this.isLoanSubmitButtonDisabled = true;
    setTimeout(() => {
      this.isLoanSubmitButtonDisabled = false;
    }, environment.loanSubmitButtonDisabledTimeOut * 1000); // Multiply by 1000 to get milliseconds
    
    this.submit.emit()
  }

}
