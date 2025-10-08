import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { RequestInfoDialogComponent } from '../request-info-dialog/request-info-dialog.component';
import { ClientsService } from '../../../clients/clients.service';
import { TasksService } from 'app/tasks/tasks.service';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-client-details-dialog',
  templateUrl: './client-details-dialog.component.html',
  styleUrls: ['./client-details-dialog.component.scss']
})
export class ClientDetailsDialogComponent implements OnInit, OnDestroy {
  client: any;
  clientImage: any;
  loading: boolean = true;
  identifierImage: any;
  private _idImageObjectUrl: string | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<ClientDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clientId: string; auditId: string, canRequestMoreInfo?: boolean },
    private readonly clientService: ClientsService,
    private readonly tasksService: TasksService,
    private readonly sanitizer: DomSanitizer
  ) {
    this.data.canRequestMoreInfo = this.data.canRequestMoreInfo ?? true;
  }

  ngOnInit(): void {
    const maxHeight = 150;
    let identifierId = null;

    forkJoin({
      client: this.clientService.getClientData(this.data.clientId),
      image: this.tasksService.getClientImage(this.data.clientId, maxHeight).pipe(
        catchError(err => {
          console.warn("Client image not found, continuing without it", err);
          return of(null);
        })
      )
    })
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({ client, image }) => {
          this.client = client;
          if (!client) {
            console.warn("No client data, stopping popup content");
            return of(null);
          }

          this.clientImage = image ? this.sanitizer.bypassSecurityTrustResourceUrl(image) : null;

          identifierId = this.client?.identifiers?.[0]?.id;
          if (!identifierId) {
            return of(null);
          }

          return this.clientService.getClientIdentificationDocuments(identifierId);
        }),
        switchMap(identifierDetails => {
          if (!identifierDetails) {
            return of(null);
          }

          const docs = identifierDetails as any[];
          const docId = docs?.[0]?.id;
          if (!docId) {
            return of(null);
          }

          return this.clientService.downloadClientIdentificationDocument(identifierId, docId);
        })
      )
      .subscribe({
        next: idImage => {
          let url: string | null = null;
          if (idImage instanceof Blob) {
            url = window.URL.createObjectURL(idImage);
          }
          this.identifierImage = url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
          this._idImageObjectUrl = url;
          this.loading = false;
        },
        error: err => {
          console.error("Error during chain", err);
          this.loading = false;
        }
      });
  }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
     if (this._idImageObjectUrl) {
        URL.revokeObjectURL(this._idImageObjectUrl);
          this._idImageObjectUrl = null;
        }
    }


  onCancel() {
    this.dialogRef.close();
  }

  openConfirm() {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        heading: 'Approve the entry',
        dialogContext: 'Are you sure you want to approve the request?'
      }
    }).afterClosed().subscribe(result => {
      if (result?.confirm) {
        this.tasksService.executeMakerCheckerAction(this.data.auditId, "approve")
          .subscribe(() => {
            this.dialogRef.close('confirmed');
          });
      }
    });
  }

  openRequestInfo() {
    if(this.data.canRequestMoreInfo && this.data?.auditId) {
      this.dialog.open(RequestInfoDialogComponent, {
        width: '400px',
        data: { client: this.client, auditId: this.data.auditId }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close();
          this.router.navigate(['/checker-inbox-and-tasks']);
        }
      });
    }
  }
}
