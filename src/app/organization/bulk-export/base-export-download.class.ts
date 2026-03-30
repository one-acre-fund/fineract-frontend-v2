import { Directive, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { OrganizationService } from '../organization.service';
import { ProductsService } from 'app/products/products.service';
import { APP_CONSTANTS } from 'app/shared/constants/app.constants';

/**
 * Abstract base class for bulk export download components.
 * Subclasses only need to provide the exportType value.
 */
@Directive()
export abstract class BaseExportDownloadComponent implements OnInit {
  /** The export type passed to the API (e.g. 'nonPickers', 'unqualified') */
  abstract readonly exportType: string;

  countriesData: any[] = [];
  countriesDataSliced: any[] = [];
  officesData: any[] = [];
  loanProductsData: any[] = [];
  downloadForm: UntypedFormGroup;
  selectedCountryName = '';

  constructor(
    protected route: ActivatedRoute,
    protected formBuilder: UntypedFormBuilder,
    protected organizationService: OrganizationService,
    protected productsService: ProductsService
  ) {
    this.route.data.subscribe((data) => {
      this.countriesData = data.countries;
      this.countriesDataSliced = this.countriesData;
    });
  }

  ngOnInit(): void {
    this.downloadForm = this.formBuilder.group({
      countryId: [''],
      officeId: [''],
      loanProductIds: [[]],
    });

    const stored = sessionStorage.getItem(APP_CONSTANTS.SESSION_STORAGE.SELECTED_COUNTRY);
    if (stored) {
      const country = JSON.parse(stored);
      const match = this.countriesData.find((c: any) => c.id === country.id) || country;
      this.downloadForm.patchValue({ countryId: match.id });
      this.selectedCountryName = match.name;
      this._loadCountryData(match.id);
    }
  }

  isFiltered(country: any) {
    return this.countriesDataSliced.find((item: any) => item.id === country.id);
  }

  private _loadCountryData(countryId: number): void {
    this.officesData = [];
    this.loanProductsData = [];
    this.downloadForm.patchValue({ officeId: '', loanProductIds: [] });
    this.organizationService.searchCountryById(countryId, false, 'bulk-import-template-office-hierarchy-level').subscribe((res: any[]) => {
      this.officesData = (res || []).filter((x: any) => x.status === true);
    });
    this.productsService.getLoanProductWithCountryId(countryId).subscribe((res: any[]) => {
      this.loanProductsData = res || [];
    });
  }

  download() {
    const { countryId, officeId, loanProductIds } = this.downloadForm.value;
    if (countryId && officeId) {
      let urlSuffix = `/loanproducts/export?exportType=${this.exportType}&countryId=${countryId}&officeId=${officeId}`;
      if (loanProductIds && loanProductIds.length > 0) {
        urlSuffix += `&loanProductIds=${loanProductIds.join(',')}`;
      }
      this.organizationService.downloadOutputTemplate(urlSuffix).subscribe((res: any) => {
        this.organizationService.downloadFileFromAPIResponse(res);
      });
    }
  }
}
