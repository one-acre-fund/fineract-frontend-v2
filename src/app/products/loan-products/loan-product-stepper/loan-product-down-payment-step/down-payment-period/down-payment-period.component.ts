import { Component, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';

import { DownPaymentFormStore } from '../../../down-payment/down-payment-form.store';

/**
 * One period of a down payment configuration: the stretch of time it covers, with the principal bands that apply in
 * it. The single period of a STATIC configuration has no dates and covers all the time.
 */
@Component({
  selector: 'mifosx-down-payment-period',
  templateUrl: './down-payment-period.component.html',
  styleUrls: ['./down-payment-period.component.scss'],
})
export class DownPaymentPeriodComponent {
  @Input() configurationIndex: number;
  @Input() periodIndex: number;
  @Input() isStatic: boolean;
  @Input() amountCalculationTypeOptions: any;

  constructor(public store: DownPaymentFormStore, private dialog: MatDialog) {}

  /** Greys out the dates another period of this configuration already covers */
  dateFilter = (date: Date | null): boolean =>
    !date || !this.store.isDateTaken(this.configurationIndex, this.periodIndex, date);

  get period(): UntypedFormGroup {
    return this.store.periodsOf(this.configurationIndex).at(this.periodIndex) as UntypedFormGroup;
  }

  get bands(): UntypedFormArray {
    return this.store.bandsOf(this.configurationIndex, this.periodIndex);
  }

  /** A STATIC configuration keeps its one period, so only a DYNAMIC one can lose periods */
  get removable(): boolean {
    return !this.isStatic;
  }

  get messages(): string[] {
    return this.store.ownMessagesFor(`configurations[${this.configurationIndex}].periods[${this.periodIndex}]`);
  }

  addBand(): void {
    this.store.addBand(this.configurationIndex, this.periodIndex);
  }

  remove(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: { deleteContext: `down payment period` } });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response?.delete) {
        this.store.removePeriod(this.configurationIndex, this.periodIndex);
      }
    });
  }
}
