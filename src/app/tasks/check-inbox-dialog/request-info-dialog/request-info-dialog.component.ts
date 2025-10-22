import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'app/core/alert/alert.service';
import { TasksService } from 'app/tasks/tasks.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-request-info-dialog',
  templateUrl: './request-info-dialog.component.html',
})
export class RequestInfoDialogComponent {
  form: FormGroup;
  kycFields: any = [{ id: 1, name: "First Name" }, { id: 2, name: "Middle Name" }, { id: 3, name: "Last Name" }, { id: 4, name: "Date Of Birth" }, { id: 5, name: "Gender" }, { id: 6, name: "National ID Image" }, { id: 7, name: "Client Image" }, { id: 8, name: "Mobile No" }]

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<RequestInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly taskService: TasksService,
    private readonly alertService: AlertService,
  ) {
    this.form = this.fb.group({
      failedKycFields: ['', Validators.required],
      kycRejectionNotes: ['', Validators.required]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      this.submit();
    }
  }

  submit() {
    const data = { ...this.form.value };
    this.taskService.rejectClientVerification(this.data.client.id, data).pipe(
      switchMap(() => this.taskService.executeMakerCheckerAction(this.data.auditId, "reject"))
    ).subscribe({
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
