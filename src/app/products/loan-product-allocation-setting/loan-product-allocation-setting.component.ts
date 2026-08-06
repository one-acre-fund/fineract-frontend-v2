import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';

@Component({
  selector: 'mifosx-loan-product-allocation-setting',
  templateUrl: './loan-product-allocation-setting.component.html',
  styleUrls: ['./loan-product-allocation-setting.component.scss'],
})
export class LoanProductAllocationSettingComponent implements OnInit {
  loanProductAllocationData: any[] = [];
  displayedColumns: string[] = ['name', 'ou', 'repaymentChoice', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: any = null;
  @ViewChild(MatSort, { static: true }) sort: any = null;

  constructor(private route: ActivatedRoute, private productsService: ProductsService) {
    this.route.data.subscribe({
      next: (data: any) => {
        this.setTableData(data.loanProductAllocationData);
      }
    });
  }

  ngOnInit() {
    this.dataSource.data = this.loanProductAllocationData;
    this.dataSource.sort = this.sort;
  }

  private setTableData(response: any): void {
    const content = response?.pageItems || response?.content || [];
    this.loanProductAllocationData = content.map((element: any) => {
      const setting = element.loanPaymentAllocationSetting;
      let repaymentSummary = setting.repaymentChoice.replace(/_/g, ' ');
      if (setting.systemChoice) {
        repaymentSummary += ' - ' + setting.systemChoice.replace(/_/g, ' ');
        if (setting.liabilityPriority) {
          repaymentSummary += ' - ' + setting.liabilityPriority;
        }
        if (setting.disbursementDateOrder) {
          repaymentSummary += ' - ' + setting.disbursementDateOrder;
        }
      }
      return {
        id: element.id,
        name: element.officeCountry.name,
        ou: element.districtOffice.name,
        repaymentChoice: repaymentSummary
      };
    });

    this.totalRecords = response?.total || response?.totalFilteredRecords || response?.totalElements || this.loanProductAllocationData.length;
    this.pageIndex = response?.pageable?.page ?? this.pageIndex;
    this.pageSize = response?.pageable?.size ?? this.pageSize;
    this.dataSource.data = this.loanProductAllocationData;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.productsService.getLoanProductAllocationSetting(this.pageIndex, this.pageSize).subscribe((response: any) => {
      this.setTableData(response);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
