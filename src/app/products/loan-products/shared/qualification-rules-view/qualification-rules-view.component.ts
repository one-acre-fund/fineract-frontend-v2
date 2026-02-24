import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mifosx-qualification-rules-view',
  templateUrl: './qualification-rules-view.component.html',
  styleUrls: ['./qualification-rules-view.component.scss']
})
export class QualificationRulesViewComponent implements OnInit {
  @Input() loanProduct: any;
  @Input() loanTypeId: any;
  @Input() loanProductsTemplate: any;

  constructor() { }

  ngOnInit(): void {
  }

  get calculationTypeDisplay() {
    return this.loanProduct.qualificationPeriods?.map(period => ({
      ...period,  // This creates a NEW object with spread operator
      fromDate: new Date(period.fromDate).toLocaleDateString(), // Format as needed
      toDate: new Date(period.toDate).toLocaleDateString(), // Format as needed
    })) || [];
  }

}
