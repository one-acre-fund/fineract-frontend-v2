/** Angular Imports */
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { TemplatesService } from '../templates.service';

/** Custom Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { extract } from 'app/core/i18n/i18n.service';

/**
 * View Template Component.
 */
@Component({
  selector: 'mifosx-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.scss']
})
export class ViewTemplateComponent implements OnDestroy {

  /** Template Data */
  templateData: any;
  private readonly destroy$ = new Subject<void>();

  /**
   * Retrieves the template data from `resolve`.
   * @param {TemplateService} templateService Accounting Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private route: ActivatedRoute,
              private templatesService: TemplatesService,
              private router: Router,
              private dialog: MatDialog) {
    this.route.data.subscribe((data: { template: any }) => {
      this.templateData = data.template;
    });
  }

  /**
   * Deletes the template and redirects to templates.
   */
  delete() {
    const deleteTemplateDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `template ${this.templateData.id}` }
    });
    deleteTemplateDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.templatesService.deleteTemplate(this.templateData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.router.navigate(['/templates']);
          });
      }
    });
  }

  activateOrDeactivateTemplate(templateId: any, isActivate: boolean) {
    const templateActionHeading = isActivate ? 'Activate Template' : 'Deactivate Template';
    const dialogContext = isActivate ? 'This will deactivate current active template and activate the selected one. Do you want to proceed?' : 'This will leave this template type without active template. Do you want to proceed?';
    const disableOutletDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: templateActionHeading, dialogContext: dialogContext }
    });
    disableOutletDialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          if (response.confirm) {
            this.templatesService.activateOrDeactivateTemplate(templateId, isActivate)
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
