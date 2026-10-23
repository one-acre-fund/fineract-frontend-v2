import { Component, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { OfficeTreeNode } from 'app/shared/office-tree-view/office-tree-node';

import { DownPaymentConfigurationType } from '../../../down-payment/down-payment-configuration.models';
import { DownPaymentFormStore } from '../../../down-payment/down-payment-form.store';

/**
 * One down payment configuration: the offices it serves and the periods of principal bands that decide the down
 * payment for them.
 */
@Component({
  selector: 'mifosx-down-payment-configuration',
  templateUrl: './down-payment-configuration.component.html',
  styleUrls: ['./down-payment-configuration.component.scss'],
})
export class DownPaymentConfigurationComponent {
  @Input() configurationIndex: number;
  @Input() amountCalculationTypeOptions: any;

  types: DownPaymentConfigurationType[] = ['STATIC', 'DYNAMIC'];

  /**
   * Open to begin with, and the user's to close from then on: binding this to whether the configuration is valid would
   * shut the panel the moment its last field is filled, and fight anyone trying to open it again.
   */
  expanded = true;

  constructor(public store: DownPaymentFormStore, private dialog: MatDialog) {}

  get configuration(): UntypedFormGroup {
    return this.store.configurations.at(this.configurationIndex) as UntypedFormGroup;
  }

  get periods(): UntypedFormArray {
    return this.store.periodsOf(this.configurationIndex);
  }

  get isStatic(): boolean {
    return this.configuration.get('type').value === 'STATIC';
  }

  get officeTree(): OfficeTreeNode[] {
    return this.store.officeTreeFor(this.configurationIndex);
  }

  get disabledOfficeIds(): number[] {
    return this.store.disabledOfficeIds(this.configurationIndex);
  }

  /** The offices this configuration serves, for the panel header */
  get officeCount(): number {
    return (this.configuration.get('officeIds').value || []).length;
  }

  /** Only the problems of the configuration itself; a period shows its own */
  get messages(): string[] {
    return this.store.ownMessagesFor(`configurations[${this.configurationIndex}]`);
  }

  onTypeChange(type: DownPaymentConfigurationType): void {
    this.store.changeType(this.configurationIndex, type);
  }

  onOfficesChecked(offices: any[]): void {
    this.store.setOfficeIds(this.configurationIndex, (offices || []).map((office) => office.id));
  }

  addPeriod(): void {
    this.store.addPeriod(this.configurationIndex);
  }

  remove(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `down payment configuration ${this.configuration.get('name').value || ''}`.trim() },
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response?.delete) {
        this.store.removeConfiguration(this.configurationIndex);
      }
    });
  }
}
