import { Directive, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { OrganizationService } from '../organization.service';
import { ProductsService } from 'app/products/products.service';

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
  regionsData: any[] = [];
  loanProductsData: any[] = [];
  downloadForm: UntypedFormGroup;

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
      regionId: [''],
      loanProductIds: [[]],
    });
  }

  isFiltered(country: any) {
    return this.countriesDataSliced.find((item: any) => item.id === country.id);
  }

  onCountryChange(country: any) {
    this.regionsData = [];
    this.loanProductsData = [];
    this.downloadForm.patchValue({ regionId: '', loanProductIds: [] });
    const countryId = country?.id;
    if (!countryId) { return; }
    this.organizationService.searchCountryById(countryId, false, 1).subscribe((res: any[]) => {
      this.regionsData = (res || []).filter((x: any) => x.status === true);
    });

     this.productsService.getLoanProductWithCountryId(countryId).subscribe((res: any[]) => {
      this.loanProductsData = res || [];
    });
  }

  download() {
    const { countryId, regionId, loanProductIds } = this.downloadForm.value;
    if (countryId && regionId) {
      let urlSuffix = `/loanproducts/export?exportType=${this.exportType}&countryId=${countryId}&officeId=${regionId}`;
      if (loanProductIds && loanProductIds.length > 0) {
        urlSuffix += `&loanProductIds=${loanProductIds.join(',')}`;
      }
      this.organizationService.downloadOutputTemplate(urlSuffix).subscribe((res: any) => {
        this.organizationService.downloadFileFromAPIResponse(res);
      });
    }
  }
}
