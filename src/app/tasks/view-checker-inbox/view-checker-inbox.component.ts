/** Angular Imports */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { TasksService } from '../tasks.service';

/** Dialog Components */
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'mifosx-view-checker-inbox',
  templateUrl: './view-checker-inbox.component.html',
  styleUrls: ['./view-checker-inbox.component.scss']
})
export class ViewCheckerInboxComponent {

  /** Checker Inbox Details Data */
  checkerInboxDetail: any;
  /** JsonData */
  jsondata: any;
  /** Checks if there is any object or not in jsondata */
  displayJSONData = false;
  clientImage: any;
  identifierDocumentImageString: any;
  clientIdentities: any[] = [];

  /**
   * Retrieves the maker checker id data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Dialog} dialog MatDialog.
   * @param {router} router Router.
   * @param {TasksService} tasksService Tasks Service.
   * @param {DomSanitizer} _sanitizer Dom sanitizer service
   */
  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private tasksService: TasksService, 
    private _sanitizer: DomSanitizer) {
    this.route.data.subscribe((data: { checkerInboxDetail: any }) => {
      this.checkerInboxDetail = data.checkerInboxDetail;
      this.jsondata = JSON.parse(this.checkerInboxDetail.commandAsJson);
      this.displayJSONData = !(_.isEmpty(this.jsondata));
      this.clientImage = this.displayJSONData && this.jsondata?.clientImage ? this._sanitizer.bypassSecurityTrustResourceUrl(this.jsondata.clientImage) : null;
      this.clientIdentities = this.displayJSONData && this.jsondata?.identifiers ? this.jsondata.identifiers : [];
      this.identifierDocumentImageString = this.clientIdentities.length > 0 ? this._sanitizer.bypassSecurityTrustResourceUrl(this.clientIdentities[0].identifierDocumentImageString) : null;  
    });
   }


   /**
    * Approve Checker
    */
  approveChecker() {
    const approveCheckerDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: 'Approve Checker', dialogContext: 'Are you sure you want to approve checker' }
    });
    approveCheckerDialogRef.afterClosed().subscribe((response: { confirm: any }) => {
      if (response.confirm) {
        this.tasksService.executeMakerCheckerAction(this.checkerInboxDetail.id, 'approve').subscribe((res: any) => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        });
      }
    });
  }

  /**
   * Reject checker
   */
  rejectChecker() {
    const rejectCheckerDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: 'Reject Checker', dialogContext: 'Are you sure you want to reject checker' }
    });
    rejectCheckerDialogRef.afterClosed().subscribe((response: { confirm: any }) => {
      if (response.confirm) {
        this.tasksService.executeMakerCheckerAction(this.checkerInboxDetail.id, 'reject').subscribe((res: any) => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        });
      }
    });
  }

  /**
   * Delete Checker
   */
  deleteChecker() {
    const deleteCheckerDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { heading: 'Delete Checker', dialogContext: 'Are you sure you want to delete checker' }
    });
    deleteCheckerDialogRef.afterClosed().subscribe((response: { confirm: any }) => {
      if (response.confirm) {
        this.tasksService.deleteMakerChecker(this.checkerInboxDetail.id).subscribe((res: any) => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        });
      }
    });
  }

}
