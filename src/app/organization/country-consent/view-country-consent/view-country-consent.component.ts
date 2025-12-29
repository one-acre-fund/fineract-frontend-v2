import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'app/organization/organization.service';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { DisableDialogComponent } from 'app/shared/disable-dialog/disable-dialog.component';
import { EnableDialogComponent } from 'app/shared/enable-dialog/enable-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mifosx-view-country-consent',
  templateUrl: './view-country-consent.component.html',
  styleUrls: ['./view-country-consent.component.scss']
})
export class ViewCountryConsentComponent implements OnInit {

  consentMessage: any;
  previewHtml: SafeHtml = '';
  private readonly destroy$ = new Subject<void>();
   
    constructor(
      private sanitizer: DomSanitizer,
      private organizationService: OrganizationService,
      private route: ActivatedRoute,
      private router: Router,
      private dialog: MatDialog
    ) {
      this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { consentMessage: any }) => {
        this.consentMessage = data.consentMessage;
        this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(this.consentMessage.consentMessage) || '';
      });
    }
  
    ngOnInit() {
  
    }
  
    deleteConsentMessage = () => {
      const deleteConsentMessageDialogRef = this.dialog.open(DeleteDialogComponent, {
        data: { deleteContext: `consent message with id: ${this.consentMessage.id}` },
      });
      deleteConsentMessageDialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.delete) {
          console.log("Confirmed deletion:");
          this.organizationService.deleteConsentMessage(this.consentMessage.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.router.navigate(["/consent-messages"]);
          });
        }
      });
    };

     activateOrDeactivateConsentMessage(consentId: any, isActivate: boolean) {
        const status = isActivate ? { enableContext: `consent message with id : ${consentId}` } : { disableContext: `consent message with id : ${consentId}` };
        const disableOutletDialogRef = this.dialog.open(isActivate ? EnableDialogComponent : DisableDialogComponent, {
          data: status
        });
        disableOutletDialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          if (response) {
            this.organizationService.activateOrDeactivateConsentMessage(consentId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.router.navigate(['../'], { relativeTo: this.route });
            });
          }
        });
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
