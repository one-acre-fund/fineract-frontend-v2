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
  /** The configurations being previewed; a saved product carries its own */
  @Input() downPaymentConfigurationsPreview: any[];

  constructor() { }

  get downPaymentConfigurations(): any[] {
    return this.downPaymentConfigurationsPreview || this.loanProduct?.downPaymentConfigurations || [];
  }

  ngOnInit(): void {
  }
}
