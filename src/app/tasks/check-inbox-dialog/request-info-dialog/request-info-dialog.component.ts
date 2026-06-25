import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'app/core/alert/alert.service';
import { TasksService } from 'app/tasks/tasks.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-request-info-dialog',
  templateUrl: './request-info-dialog.component.html',
})
export class RequestInfoDialogComponent implements OnInit {
  form: FormGroup;
  kycFields: any = [];
  kycFieldRejectionNotes: any = [];
  isRequestSubmitButtonDisabled = false

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<RequestInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly taskService: TasksService,
    private readonly alertService: AlertService,
  ) {
    this.form = this.fb.group({
      failedKycFields: [[], Validators.required],
      kycRejectionNotes: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadKycFields();
  }

  loadKycFields(): void {
    this.taskService.getClientKYCFieldsTemplate().subscribe({
      next: (response: any) => {
        if (response?.narrations?.length) {
          this.kycFields = response.narrations.map((item: any) => ({
            id: item.id,
            description: item?.description,
            name: item.name,
          }));
        } else {
          this.kycFields = [];
        }
        this.kycFieldRejectionNotes = Array.isArray(response?.kycRejectionNotes) ? response.kycRejectionNotes : [];
      },
      error: (err) => {
        this.alertService.alert({
          type: 'error',
          message: 'Failed to load KYC fields: ' + (err?.message ?? err),
        });
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.isRequestSubmitButtonDisabled = true;
        setTimeout(() => {
          this.isRequestSubmitButtonDisabled = false;
        }, environment.loanSubmitButtonDisabledTimeOut * 1000); // Multiply by 1000 to get milliseconds

    if (this.form.valid) {
      this.submit();
    }
  }

  submit() {
    const data = { ...this.form.value };
     this.taskService.rejectClientVerification(this.data?.client?.id, data).subscribe({
      next: () => {
        this.dialogRef.close(this.form.value);
      },
      error: (err) => {
        this.alertService.alert({
          type: 'error',
          message: 'Error during rejection flow: ' + (err?.message ?? err ?? 'An unexpected error occurred.')
        });
      }
    });
  }


}
