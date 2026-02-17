import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { DirectivesModule } from '../directives/directives.module';

/** Custom Components */
import { CheckerInboxAndTasksComponent } from './checker-inbox-and-tasks/checker-inbox-and-tasks.component';
import { CheckerInboxComponent } from './checker-inbox-and-tasks-tabs/checker-inbox/checker-inbox.component';
import { ClientApprovalComponent } from './checker-inbox-and-tasks-tabs/client-approval/client-approval.component';
import { LoanApprovalComponent } from './checker-inbox-and-tasks-tabs/loan-approval/loan-approval.component';
import { LoanDisbursalComponent } from './checker-inbox-and-tasks-tabs/loan-disbursal/loan-disbursal.component';
import { RescheduleLoanComponent } from './checker-inbox-and-tasks-tabs/reschedule-loan/reschedule-loan.component';
import { ViewCheckerInboxComponent } from './view-checker-inbox/view-checker-inbox.component';
import { ClientVerificationCheckerInboxComponent } from './checker-inbox-and-tasks-tabs/client-verification-checker-inbox/client-verification-checker-inbox.component';
import { ClientDetailsDialogComponent } from './check-inbox-dialog/client-details-dialog/client-details-dialog.component';
import { RequestInfoDialogComponent } from './check-inbox-dialog/request-info-dialog/request-info-dialog.component';
import { ClientPendingReVerificationCheckerInboxComponent } from './checker-inbox-and-tasks-tabs/client-pending-reverification-checker-inbox/client-pending-reverification-checker-inbox.component';
import { ClientFailedKycComponent } from './checker-inbox-and-tasks-tabs/client-failed-kyc/client-failed-kyc.component';
/**
 * Tasks Module
 */
@NgModule({
  imports: [
    SharedModule,
    TasksRoutingModule,
    DirectivesModule,
    PipesModule
  ],
  declarations: [
    CheckerInboxAndTasksComponent,
    CheckerInboxComponent,
    ClientApprovalComponent,
    LoanApprovalComponent,
    LoanDisbursalComponent,
    RescheduleLoanComponent,
    ViewCheckerInboxComponent,
    ClientVerificationCheckerInboxComponent,
    ClientDetailsDialogComponent,
    RequestInfoDialogComponent,
    ClientPendingReVerificationCheckerInboxComponent,
    ClientFailedKycComponent
  ],
  providers: [ ]
})
export class TasksModule { }
