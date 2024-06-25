/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatomoTracker } from "@ngx-matomo/tracker";

/**
 * Client Charge Overview component.
 */
@Component({
  selector: 'mifosx-charges-overview',
  templateUrl: './charges-overview.component.html',
  styleUrls: ['./charges-overview.component.scss']
})
export class ChargesOverviewComponent implements OnInit {

  /** Columns to be displayed in charge overview table. */
  displayedColumns: string[] = ['name', 'dueAsOf', 'due', 'paid', 'waived', 'outstanding'];
  /** Data source for charge overview table. */
  dataSource: MatTableDataSource<any>;
  /** Charge Overview data */
  chargeOverviewData: any;

  /** Paginator for charge overview table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /**
   * Retrieves the charge overview data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {MatDialog} dialog Dialog reference.
   * @param {MatomoTracker} matomoTracker Matomo tracker service
   */
  constructor(private route: ActivatedRoute,
              public dialog: MatDialog,
              private matomoTracker: MatomoTracker) {
      this.route.data.subscribe((data: { clientChargesData: any }) => {
        this.chargeOverviewData = data.clientChargesData;
    });
  }

  ngOnInit() {
    //set Matomo page info
    let title = document.title;
    this.matomoTracker.setDocumentTitle(`${title}`);

    this.setLoanClientChargeOverview();
  }

  /**
   * Set Client Charge Overview.
   */
  setLoanClientChargeOverview() {
    this.dataSource = new MatTableDataSource(this.chargeOverviewData.pageItems);
    this.dataSource.paginator = this.paginator;
  }

}
