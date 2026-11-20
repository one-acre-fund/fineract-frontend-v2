import { Component, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';

import { DownPaymentFormStore } from '../../../down-payment/down-payment-form.store';

/**
 * The principal bands of one period. Together they must cover every principal the product allows, without gaps or
 * overlaps, and only the band with the highest principals may be left open ended.
 */
@Component({
  selector: 'mifosx-down-payment-bands',
  templateUrl: './down-payment-bands.component.html',
  styleUrls: ['./down-payment-bands.component.scss'],
})
export class DownPaymentBandsComponent {
  @Input() configurationIndex: number;
  @Input() periodIndex: number;
  @Input() amountCalculationTypeOptions: any;

  constructor(public store: DownPaymentFormStore) {}

  get bands(): UntypedFormArray {
    return this.store.bandsOf(this.configurationIndex, this.periodIndex);
  }

  bandAt(index: number): UntypedFormGroup {
    return this.bands.at(index) as UntypedFormGroup;
  }

  /** Last by the principal it starts at, which is the only band allowed to have no maximum */
  messagesFor(bandIndex: number): string[] {
    return this.store.messagesFor(
      `configurations[${this.configurationIndex}].periods[${this.periodIndex}].bands[${bandIndex}]`
    );
  }

  removable(): boolean {
    return this.bands.length > 1;
  }

  remove(bandIndex: number): void {
    this.store.removeBand(this.configurationIndex, this.periodIndex, bandIndex);
  }
}
