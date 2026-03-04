import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mifosx-product-add-qualification-period',
  templateUrl: './product-add-qualification-period.component.html',
  styleUrls: ['./product-add-qualification-period.component.scss']
})
export class ProductAddQualificationPeriodComponent implements OnInit {

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10));

  layout: {
    addButtonText?: string
  } = {
      addButtonText: 'Add'
    };

  addQualificationPeriodForm: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ProductAddQualificationPeriodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder) {
    this.createAddQualificationPeriodForm();
  }

  ngOnInit() {
    this.dialogRef.updateSize('400px');
  }

  createAddQualificationPeriodForm() {
    this.addQualificationPeriodForm = this.formBuilder.group({
      'fromDate': ['', Validators.required],
      'toDate': ['', Validators.required],
      'prepaidAmountCalculationType': ['', Validators.required],
      'prepaidAmount': ['', [Validators.required, Validators.min(0.01)]]
    });
  }



}