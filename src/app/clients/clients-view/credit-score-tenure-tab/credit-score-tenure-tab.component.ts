/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Angular Material Imports */
import { MatTableDataSource } from '@angular/material/table';

/** Custom Services */
import { ClientsService } from '../../clients.service';
import { SettingsService } from '../../../settings/settings.service';
import { AddClientTenureDialogComponent } from '../custom-dialogs/add-client-tenure-dialog/add-client-tenure-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';

/**
 * Client Credit Score Tenure Tab Component.
 */
@Component({
  selector: 'mifosx-credit-score-tenure-tab',
  templateUrl: './credit-score-tenure-tab.component.html',
  styleUrls: ['./credit-score-tenure-tab.component.scss']
})
export class CreditScoreTenureTabComponent implements OnInit {

  /** Columns to be displayed in credit score tenure table. */
  displayedColumns: string[] = [
    'tenure',
    'recalculationReason',
    'createdDate'
  ];

  /** Data source for credit score tenure table. */
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  /** Client ID */
  clientId: string;
  /** Country ID */
  countryId: string;
  /** Total number of filtered records for pagination */
  totalRecords = 0;
  /** Current page size */
  pageSize = 10;
  /** Loading indicator */
  isLoading = false;

  /**
   * @param {ActivatedRoute} route Activated Route.
   * @param {ClientsService} clientsService Clients service.
   * @param {SettingsService} settingsService Settings service.
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly clientsService: ClientsService,
    private readonly settingsService: SettingsService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    this.clientId = this.route.parent?.snapshot.paramMap.get('clientId') || '';
    this.countryId = this.route.parent?.snapshot.data?.clientViewData?.countryId || '';
  }

  ngOnInit(): void {
    this.fetchCreditScoreTenure(0, this.pageSize);
  }

  /**
   * Sets credit score tenure data from API response.
   * @param {any} tenureData API response data.
   */
  private setCreditScoreTenureData(tenureData: any): void {
    this.dataSource.data = tenureData?.pageItems || [];
    this.totalRecords = tenureData?.totalFilteredRecords || 0;
  }

  /**
   * Fetches credit score tenure rows for current page.
   * @param {number} pageIndex Current page index.
   * @param {number} pageSize Number of records per page.
   */
  fetchCreditScoreTenure(pageIndex: number, pageSize: number): void {
    this.isLoading = true;
    const offset = pageIndex * pageSize;

    this.clientsService.getClientCreditScoreTenure(this.clientId, offset, pageSize, 'id', 'DESC')
      .subscribe({
        next: (response: any) => {
          this.setCreditScoreTenureData(response);
          this.isLoading = false;
        },
        error: () => {
          this.dataSource.data = [];
          this.totalRecords = 0;
          this.isLoading = false;
        }
      });
  }

  /**
   * Called when paginator emits a page event.
   * @param {any} event Material paginator event.
   */
  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.fetchCreditScoreTenure(event.pageIndex, event.pageSize);
  }

  openUpdateTenureDialog(): void {
    const locale = (this.translateService.currentLang || 'en').split('-')[0];
    const addClientTenureDialogRef = this.dialog.open(AddClientTenureDialogComponent, {
      data: {
        locale
      }
    });

    addClientTenureDialogRef.afterClosed().subscribe((response: any) => {
      if (response?.submit && response?.payload) {
        this.openRefreshScoresWarningDialog(response.payload);
      }
    });
  }

  private openRefreshScoresWarningDialog(payload: any): void {
    const updateTenureDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        heading: `${this.translateService.instant('labels.buttons.UpdateTenure')}`,
        dialogContext: this.translateService.instant('labels.text.UpdateTenureRefreshScoresWarning'),
        type: 'Mild'
      }
    });

    updateTenureDialogRef.afterClosed().subscribe((response: { confirm: boolean }) => {
      if (response?.confirm) {
        this.clientsService.saveClientTenure(this.countryId, this.clientId, payload, true).subscribe(() => {
          this.fetchCreditScoreTenure(0, this.pageSize);
          this.snackBar.open(
            this.translateService.instant('labels.text.TenureAndCreditScoreUpdateSuccessful'),
            this.translateService.instant('labels.buttons.Close'),
            { duration: 3000 }
          );
          this.router.navigate(['/clients', this.clientId, 'general']);
        });
      }
    });
  }

  get dateTimeFormat(): string {
    return this.settingsService.dateFormat.replace('dd', 'DD').concat(' HH:mm:ss');
  }
}
