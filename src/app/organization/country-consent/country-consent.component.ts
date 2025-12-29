import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../organization.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';

@Component({
  selector: 'mifosx-country-consent',
  templateUrl: './country-consent.component.html',
  styleUrls: ['./country-consent.component.scss']
})
export class CountryConsentComponent implements OnInit, AfterViewInit, OnDestroy {
  outletData: any;
      displayedColumns: string[] = ['consentName', 'countryName', 'category', 'isActive'];
      categories: any[] = [];
      dataSource: MatTableDataSource<any>;
      searchData: any[] = [];
      consentMessageSearchForm!: UntypedFormGroup;
      listCountries: any = [];

          @ViewChild(MatPaginator) paginator: MatPaginator;
          @ViewChild(MatSort) sort: MatSort;

          private readonly destroy$ = new Subject<void>();
          pageSize = 10;
          pageIndex = 0;
          totalElements = 0;
      
        constructor(
          private route: ActivatedRoute, 
          private organizationService: OrganizationService,
          protected formBuilder: UntypedFormBuilder) {
          this.route.data
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: { consentMessages: any }) => {
                this.searchData = data.consentMessages?.content || [];
                this.dataSource = new MatTableDataSource(this.searchData);
                this.totalElements = data.consentMessages?.total || 0;
              });
        }
      
        /**
         * Filters data in offices table based on passed value.
         * @param {string} filterValue Value to filter data.
         */
         applyFilter(filterValue: string) {
          this.dataSource.filter = filterValue.trim().toLowerCase();
        }
      
        ngOnInit(): void {
          this.getCountries();
          this.getConsentCategories();
          this.createConsentMessageSearchForm();
        }

        getCountries() {
          this.organizationService.getCountries()
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.listCountries = res;
          });
        }

        getConsentCategories() {
        this.organizationService.getCountryConsentMessageCategories()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.categories = res;
        });
        }

        ngAfterViewInit(): void {
          if (!this.paginator || !this.sort) {
            console.error('Paginator or Sort not initialized');
            return;
          }

          // Assign paginator and sort to dataSource
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.sort.sortChange
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            if (this.paginator) {
              this.paginator.pageIndex = 0;
            }
          });

          // Subscribe to form changes after view init
          this.consentMessageSearchForm.valueChanges
            .pipe(
              takeUntil(this.destroy$),
              tap(() => {
                if (this.paginator) {
                  this.paginator.pageIndex = 0;
                }
                this.loadConsentData();
              })
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe();

          merge(
            this.sort.sortChange,
            this.paginator.page
          )
            .pipe(
              takeUntil(this.destroy$),
              tap(() => {
                this.pageIndex = this.paginator.pageIndex;
                this.pageSize = this.paginator.pageSize;
                this.loadConsentData();
              })
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe();

          // Load initial data
          this.loadConsentData();
        }
      
        loadConsentData() {
          const pageIndex = this.paginator ? this.paginator.pageIndex : this.pageIndex;
          const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
          const formValues = this.consentMessageSearchForm.value;

          const params: any = {
            pageNumber: pageIndex,
            pageSize: pageSize
          };

          if (formValues.activeConsentMessages) {
            params.activeConsentMessages = formValues.activeConsentMessages;
          }
          if (formValues.countryId) {
            params.countryId = formValues.countryId;
          }
          if (formValues.consentCategory) {
            params.consentCategory = formValues.consentCategory;
          }
       
          this.organizationService.getCountryConsentMessages(params)
          .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response: any) => {
                this.searchData = response?.content || [];
                this.dataSource = new MatTableDataSource(this.searchData);
                this.totalElements = response?.total || 0;
              },
              error: (err) => {
                console.error('Error fetching consents:', err);
                this.dataSource.data = [];
              }
            });
       
         }

        ngOnDestroy(): void {
          this.destroy$.next();
          this.destroy$.complete();
        }

        createConsentMessageSearchForm(): void {
          this.consentMessageSearchForm = this.formBuilder.group({
            countryId: [null],
            consentCategory: [null],
            activeConsentMessages: [null]
          });
      }

}
