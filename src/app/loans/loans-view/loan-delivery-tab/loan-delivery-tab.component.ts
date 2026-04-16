import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LoansService } from 'app/loans/loans.service';
import { throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Component({
  selector: 'mifosx-loan-delivery-tab',
  templateUrl: './loan-delivery-tab.component.html',
  styleUrls: ['./loan-delivery-tab.component.scss']
})
export class LoanDeliveryTabComponent implements OnInit {

  loanDetails: any;
  loanDeliveryDetails: any;
  status: any;
  loanDeliveryDetailsColumns: string[] = ['Key', 'Value'];
  loanDeliveryDetailsTableData: {
    'key': string,
    'value'?: string
  }[];
  dataSource: MatTableDataSource<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loansService: LoansService
  ) {
    this.route.parent.data.subscribe((data: { loanDetailsData: any }) => {
      this.loanDetails = data.loanDetailsData;
      this.loanDeliveryDetails = this.loanDetails.loanProductsDeliveryData;
    });
  }

  ngOnInit(): void {
      this.setloanDeliveryDetailsTableData();
  }

  setloanDeliveryDetailsTableData() {

    this.loanDeliveryDetailsTableData = [
      {
        'key': 'loan.delivery.status',
        'value': this.loanDeliveryDetails?.deliveryStatus
      },
      {
        'key': 'loan.date.delivered',
        'value': this.loanDeliveryDetails?.dateDelivered
      },
      {
        'key': 'loan.delivery.group.name',
        'value': this.loanDeliveryDetails?.groupName
      },
      {
        'key': 'loan.delivery.product.name',
        'value': this.loanDeliveryDetails?.loanProductName
      },
      {
        'key': 'loan.delivery.application.cycle.id',
        'value': this.loanDeliveryDetails?.loanApplicationCycleId,
      }
    ];
    this.dataSource = new MatTableDataSource(this.loanDeliveryDetailsTableData);

  }

  retryLoanDelivery() {
  console.log('Retrying loan delivery for loan ID:', this.loanDetails);
  const retryPayload = {
    loanId: this.loanDetails.id,
  };
  this.loansService.retryLoanDelivery(retryPayload)
    .pipe(
      timeout(30000), // 30 seconds
      catchError(error => {
        console.error('Loan delivery retry failed or timed out:', error);
        return throwError(() => error);
      })
    )
    .subscribe(() => {
      const clientId = this.loanDetails.clientId;
      const url: string = this.router.url;
      this.router
        .navigateByUrl(`/clients/${clientId}/loans-accounts`, { skipLocationChange: true })
        .then(() => this.router.navigate([url]));
    });
}

}
