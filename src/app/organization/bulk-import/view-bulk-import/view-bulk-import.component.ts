/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';

/** Custom Imports */
import { OrganizationService } from '../../organization.service';
import { BulkImports } from './bulk-imports';
import { ClientsService } from 'app/clients/clients.service';
import { AlertService } from 'app/core/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { BulkImportsConstants } from './bulk-imports-constant';

/**
 * View Bulk Imports Component
 */
@Component({
  selector: 'mifosx-view-bulk-import',
  templateUrl: './view-bulk-import.component.html',
  styleUrls: ['./view-bulk-import.component.scss'],
})
export class ViewBulkImportComponent implements OnInit {
  /** offices Data */
  officeData: any;
  officeDataSliced: any;
  /** Selected office object (officeData items already have isLowestOU, parentId). */
  selectedOffice: any = null;
  /** Chain of office levels: each has parent label and options from fetchByHierarchyLevel(., 'LOWER'). */
  officeChainLevels: { parentName: string; options: any[] }[] = [];
  /** Countries data */
  countriesData: any;
  countriesDataSliced: any;
  countryConfigurations: any;
  /** staff Data */
  staffData: any;
  /** Entity Template */
  template: File;
  /** imports Data */
  importsData: any;
  /** bulk-import form. */
  bulkImportForm: UntypedFormGroup;
  /** array of deined bulk-imports */
  bulkImportsArray = BulkImports;
  /** bulk-import which user navigated to */
  bulkImport: any = {};
  /** Data source for imports table. */
  dataSource = new MatTableDataSource();
  /** Columns to be displayed in imports table. */
  displayedColumns: string[] = [
    'name',
    'importTime',
    'endTime',
    'completed',
    'totalRecords',
    'successCount',
    'failureCount',
    'download',
  ];

  /** Paginator for imports table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for imports table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  /** Imports table reference */
  @ViewChild('importsTable', { static: true }) importsTableRef: MatTable<Element>;

  /**
   * fetches offices and imports data from resolve
   * @param {ActivatedRoute} route ActivatedRoute
   * @param {FormBuilder} formBuilder FormBuilder
   * @param {OrganizationService} organizationService OrganizationService
   */
  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private organizationService: OrganizationService,
    private clientsService: ClientsService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.bulkImport.name = this.route.snapshot.params['import-name'];

    this.route.data.subscribe((data: { offices: any; imports: any; countries: any }) => {
      this.officeData = data.offices;
      this.officeDataSliced = this.officeData;
      this.countriesData = data.countries;
      this.countriesDataSliced = this.countriesData;
      this.importsData = data.imports;
    });
  }

  /**
   * Gets bulk import's properties.
   */
  ngOnInit() {
    this.bulkImport = this.bulkImportsArray.find((entry) => entry.name === this.bulkImport.name);
    this.createBulkImportForm();
    this.setImports();
  }

  /**
   * Safely translates bulk import name with fallback to original name.
   * Checks labels.heading first, then labels.commons (for menu consistency), then uses original name.
   * @param {string} name Bulk import name
   * @returns Translated name or original name if translation not found
   */
  getTranslatedName(name: string): string {
    const headingKey = 'labels.heading.' + name;
    const commonsKey = 'labels.commons.' + name;

    // Try heading translation first
    let translated = this.translate.instant(headingKey);
    if (translated !== headingKey) {
      return translated;
    }

    // Fall back to commons translation (for menu consistency)
    translated = this.translate.instant(commonsKey);
    if (translated !== commonsKey) {
      return translated;
    }

    // Fall back to original name
    return name;
  }

  /**
   * Used for filtering office dropdownlist.
   */
  public isFiltered(office: any) {
    return this.officeDataSliced.find((item) => item.id === office.id);
  }

  /**
   * Used for filtering country dropdownlist.
   */
  public isCountryFiltered(country: any) {
    return this.countriesDataSliced.find((item) => item.id === country.id);
  }

  /**
   * Creates the bulk import form.
   */
  createBulkImportForm() {
    const isOfficeRequired = this.bulkImport.name === 'Savings Transactions';
    this.bulkImportForm = this.formBuilder.group({
      countryId: [''],
      officeId: ['', isOfficeRequired ? Validators.required : []],
      childOfficeLevels: this.formBuilder.array([]),
      staffId: [''],
      legalForm: [''],
    });
  }

  get childOfficeLevelsFormArray(): FormArray {
    return this.bulkImportForm.get('childOfficeLevels') as FormArray;
  }

  /**
   * Truncates child levels to the given count and optionally adds one more level with options.
   */
  private setChildLevelsCount(count: number, appendOptions?: { parentName: string; options: any[] }) {
    while (this.childOfficeLevelsFormArray.length > count) {
      this.childOfficeLevelsFormArray.removeAt(this.childOfficeLevelsFormArray.length - 1);
    }
    this.officeChainLevels = this.officeChainLevels.slice(0, count);
    if (appendOptions) {
      this.officeChainLevels.push(appendOptions);
      this.childOfficeLevelsFormArray.push(this.formBuilder.control('', Validators.required));
    }
  }

  /**
   * Handles first office selection. When not lowest OU, fetches offices under it and shows first child dropdown.
   */
  onOfficeChange(office: any) {
    this.officeChainLevels = [];
    while (this.childOfficeLevelsFormArray.length) {
      this.childOfficeLevelsFormArray.removeAt(0);
    }
    this.selectedOffice = null;
    if (!office || !office.id) {
      return;
    }
    const fullOffice = this.officeData?.find((o: any) => o.id === office.id);
    this.selectedOffice = fullOffice || office;
    if (this.bulkImport.name === 'Savings Transactions' && this.selectedOffice && !this.selectedOffice.isLowestOU) {
      this.organizationService.fetchByHierarchyLevel(this.selectedOffice.id, 'LOWER').subscribe((response: any) => {
        const options = (response || []).filter((x: any) => x.status === true);
        this.setChildLevelsCount(0, { parentName: this.selectedOffice.name, options });
      });
    }
    this.retrieveStaffData(office.id);
  }

  /**
   * Handles selection at a child level. If selected office is not lowest OU, fetches offices under it and adds next dropdown.
   */
  onChildOfficeChange(levelIndex: number, selectedOffice: any) {
    if (!selectedOffice || !selectedOffice.id) return;
    this.setChildLevelsCount(levelIndex + 1);
    const isLowest = selectedOffice.isLowestOU === true;
    if (isLowest) return;
    this.organizationService.fetchByHierarchyLevel(selectedOffice.id, 'LOWER').subscribe((response: any) => {
      const options = (response || []).filter((x: any) => x.status === true);
      this.officeChainLevels.push({ parentName: selectedOffice.name, options });
      this.childOfficeLevelsFormArray.push(this.formBuilder.control('', Validators.required));
    });
  }

  getSelectedOfficeId(): number | null {
    return this.bulkImportForm.get('officeId')?.value;
  }

  getEffectiveOfficeId(): number | null {
    const officeId = this.getSelectedOfficeId();
    if (this.bulkImport.name !== BulkImportsConstants.SAVINGS_TRANSACTIONS_IMPORT) {
      return officeId || null;
    }
    if (!officeId) return null;
    if (this.selectedOffice?.isLowestOU) {
      return officeId;
    }
    const arr = this.childOfficeLevelsFormArray;
    if (arr.length === 0) return null;
    const lastId = arr.at(arr.length - 1).value;
    return lastId || null;
  }

  /**
   * Fetches staff data where necessary.
   */
  retrieveStaffData(officeId: any) {
    if (this.bulkImport.formFields >= 2 || this.bulkImport.name == 'Healthy Path') {
      this.organizationService.getStaff(officeId).subscribe((data: any) => {
        this.staffData = data;
      });
    }
  }

  /**
   * Initializes the data source, paginator and sorter for imports table.
   */
  setImports() {
    this.dataSource = new MatTableDataSource(this.importsData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isDownloadTemplateDisabled(): boolean {
    switch (this.bulkImport.name) {
      case BulkImportsConstants.CLIENT_TRANSFER_IMPORT:
        return !this.getSelectedOfficeId();
      case BulkImportsConstants.SAVINGS_TRANSACTIONS_IMPORT:
        return !this.getEffectiveOfficeId();

      default:
        return false;
    }
  }

  /**
   * Gets bulk import's downloadable template from API.
   */
  downloadTemplate() {
    const countryId = this.bulkImportForm.get('countryId')?.value;
    const officeId = this.bulkImport.name === BulkImportsConstants.SAVINGS_TRANSACTIONS_IMPORT ? this.getEffectiveOfficeId() : this.bulkImportForm.get('officeId')?.value;
    const staffId = this.bulkImportForm.get('staffId')?.value;
    let legalFormType = '';
    /** Only for Client Bulk Imports */
    switch (this.bulkImportForm.get('legalForm')?.value) {
      case 'Person':
        legalFormType = 'CLIENTS_PERSON';
        break;
      case 'Entity':
        legalFormType = 'CLIENTS_ENTTTY';
        break;
    }
    this.organizationService
      .getImportTemplate(this.bulkImport.urlSuffix, countryId, officeId, staffId, legalFormType)
      .subscribe((res: any) => {
        this.organizationService.downloadFileFromAPIResponse(res);
      });
  }

  onCountryChange(countryId: any) {
    let commandParam,
      staffInSelectedOfficeOnly = true;

    switch (this.bulkImport.name) {
      case BulkImportsConstants.CLIENTS_IMPORT:
      case BulkImportsConstants.CLIENT_TRANSFER_IMPORT:
      case BulkImportsConstants.CLIENT_GROUP_REMOVAL_IMPORT:
      case BulkImportsConstants.GROUPS_IMPORT:
      case BulkImportsConstants.OFFICES_IMPORT:
      case BulkImportsConstants.SAVINGS_TRANSACTIONS_IMPORT:
      case BulkImportsConstants.LOAN_ACCOUNTS_IMPORT:
        commandParam = 'clientBulkImportTemplate';
        break;
      default:
        commandParam = '';
        break;
    }

    if (this.bulkImport.name != 'Loan Repayments' && this.bulkImport.name !== 'Health Path') {
      this.getClientCommandTemplateForBulkImport(countryId, commandParam, staffInSelectedOfficeOnly);
    }
  }

  getClientCommandTemplateForBulkImport(countryId: any, commandParam: string, staffInSelectedOfficeOnly: boolean) {
    this.clientsService
      .getClientCommandTemplateForBulkImport(commandParam, countryId, staffInSelectedOfficeOnly)
      .subscribe((data: any) => {
        this.officeData = data.officeOptions;
        this.officeDataSliced = this.officeData;
      });
  }
  /**
   * Sets file form control value.
   * @param {any} $event file change event.
   */
  onFileSelect($event: any) {
    if ($event.target.files.length > 0) {
      this.template = $event.target.files[0];
    }
  }

  /**
   * Upload excel file containing bulk import data.
   */
  uploadTemplate() {
    let legalFormType = '';
    /** Only for Client Bulk Imports */
    if (this.bulkImport.name === BulkImportsConstants.CLIENTS_IMPORT) {
      if (this.template.name.toLowerCase().includes('entity')) {
        legalFormType = 'CLIENTS_ENTTTY';
      } else if (this.template.name.toLowerCase().includes('person')) {
        legalFormType = 'CLIENTS_PERSON';
      }
    }
    let countryId = null;
    switch (this.bulkImport.name) {
      case BulkImportsConstants.LOAN_REPAYMENTS_IMPORT:
      case BulkImportsConstants.ACCOUNT_TRANSFER_TRANSACTION_IMPORT:
      case BulkImportsConstants.CLIENT_TRANSFER_IMPORT:
      case BulkImportsConstants.GROUP_OFFICE_TRANSFER_IMPORT:
      case BulkImportsConstants.CLIENT_GROUP_REMOVAL_IMPORT:
        countryId = this.bulkImportForm.get('countryId')?.value;
        if (!countryId) {
          return this.alertService.alert({
            type: 'Error while uploading a file',
            message: 'Please select a country',
          });
        }
        break;
    }

    this.organizationService
      .uploadImportDocument(this.template, this.bulkImport.urlSuffix, legalFormType, countryId)
      .subscribe(() => {
        this.refreshDocuments();
      });
  }

  /**
   * Reloads imports data table.
   */
  refreshDocuments() {
    this.organizationService.getImports(this.bulkImport.entityType).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.importsTableRef.renderRows();
    });
  }

  /**
   * Download import document.
   * @param {string} name Import Name
   * @param {any} id ImportID
   */
  downloadDocument(name: string, id: any) {
    this.organizationService.getImportDocument(id).subscribe((res: any) => {
      const contentType = res.headers.get('Content-Type');
      const blob = new Blob([res.body], { type: contentType });
      const fileOfBlob = new File([blob], name, { type: contentType });
      window.open(window.URL.createObjectURL(fileOfBlob));
    });
  }
}
