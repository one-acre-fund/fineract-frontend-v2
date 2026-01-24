/** Angular Imports */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TemplatesService } from './templates.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Templates component.
 */
@Component({
  selector: 'mifosx-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Templates data. */
  templatesData: any;
  entityAndTypesTemplateData: any;
  templateTypes: any[] = [];
  /** Columns to be displayed in templates table. */
  displayedColumns: string[] = ['entity', 'type', 'name', 'isActive'];
  /** Data source for templates table. */
  dataSource: MatTableDataSource<any>;

  /** Subject for component destruction. */
  private readonly destroy$ = new Subject<void>();

  /** Paginator for templates table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for templates table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  templateSearchForm!: UntypedFormGroup;

  /**
   * Retrieves the templates data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(
    private route: ActivatedRoute, 
    protected formBuilder: UntypedFormBuilder,
    private settingsService: SettingsService,
    private translateService: TranslateService,
    private templateService: TemplatesService) {
    this.route.data.subscribe((data: { templates: any, entityAndTypesTemplateData: any }) => {
      this.templatesData = data.templates?.content || [];
      this.entityAndTypesTemplateData = data.entityAndTypesTemplateData;
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
    this.templateSearchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }
          this.loadConsentData();
        })
      ).subscribe();

      merge(
        this.sort.sortChange,
        this.paginator.page
      ).pipe(
          takeUntil(this.destroy$),
          tap(() => {
            this.pageIndex = this.paginator.pageIndex;
            this.pageSize = this.paginator.pageSize;
            this.loadConsentData();
          })
        ).subscribe();

        // Load initial data
    this.loadConsentData();
  }

  /**
   * Sets the templates table.
   */
  ngOnInit() {
    this.setTemplates();
    this.createTemplateSearchForm();
    this.buildTemplateTypeDependencies();
  }

  /**
   * Initializes the data source, paginator and sorter for templates table.
   */
  setTemplates() {
    this.dataSource = new MatTableDataSource(this.templatesData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createTemplateSearchForm(): void {
    this.templateSearchForm = this.formBuilder.group({
      templateEntity: [null],
      templateType: [null],
      activeTemplates: [null]
    });
}

/**
   * Subscribe to value changes of entity to set template types.
   */
buildTemplateTypeDependencies() {
  this.templateSearchForm.get('templateEntity').valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
    this.templateSearchForm.get('templateType').patchValue(null);
    this.templateTypes = this.entityAndTypesTemplateData.entities.filter((entity: any) => entity.code === value)[0]?.templateTypes;
  });
}

loadConsentData() {
  const pageIndex = this.paginator ? this.paginator.pageIndex : this.pageIndex;
  const pageSize = this.paginator ? this.paginator.pageSize : this.pageSize;
  const formValues = this.templateSearchForm.value;

  const params: any = {
    pageNumber: pageIndex,
    pageSize: pageSize
  };

  if (formValues.activeTemplates) {
    params.activeOnly = formValues.activeTemplates;
  }
  let countryId = this.settingsService.getSelectedCountry()?.id;
  if (countryId) {
    params.countryId = countryId;
  }
  if (formValues.templateType) {
    params.templateType = formValues.templateType;
  }

  if (formValues.templateEntity) {
    params.templateEntity = formValues.templateEntity;
  }

  this.templateService.getTemplates(params)
  .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        this.templatesData = response?.content || [];
        this.dataSource.data = this.templatesData;
        this.totalElements = response?.total || 0;
      },
      error: (err) => {
        console.error('Error fetching consents:', err);
        this.dataSource.data = [];
      }
    });

 }

  getIsActiveLabel(isActive: boolean): string {
    const activeLabelKey = isActive ? 'labels.inputs.Active' : 'labels.catalogs.Inactive';
   return this.translateService.instant(activeLabelKey);
 }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

}
