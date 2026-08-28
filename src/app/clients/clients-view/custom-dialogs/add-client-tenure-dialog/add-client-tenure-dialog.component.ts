/** Angular Imports */
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Add client tenure dialog component.
 */
@Component({
  selector: 'mifosx-add-client-tenure-dialog',
  templateUrl: './add-client-tenure-dialog.component.html',
  styleUrls: ['./add-client-tenure-dialog.component.scss']
})
export class AddClientTenureDialogComponent implements OnInit {
  tenureForm: any;

  /**
   * @param {MatDialogRef} dialogRef Component reference to dialog.
   * @param {UntypedFormBuilder} formBuilder Form builder.
   * @param {any} data Dialog data.
   */
  constructor(
    public dialogRef: MatDialogRef<AddClientTenureDialogComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tenureForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.createTenureForm();
  }

  private createTenureForm(): void {
    this.tenureForm = this.formBuilder.group({
      tenure: [0, [Validators.required, Validators.min(0)]],
      recalculationReason: ['NEW', [Validators.required, Validators.maxLength(50)]],
      locale: [this.data?.locale || 'en', Validators.required]
    });
  }

  submit(): void {
    if (this.tenureForm.invalid) {
      return;
    }

    const payload = {
      tenure: Number(this.tenureForm.value.tenure),
      contractStatus: 'Active',
      recalculationReason: this.tenureForm.value.recalculationReason,
      locale: this.tenureForm.value.locale
    };

    this.dialogRef.close({ submit: true, payload });
  }
}
