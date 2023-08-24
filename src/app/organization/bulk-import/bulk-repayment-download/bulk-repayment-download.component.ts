import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";


import { OrganizationService } from "../../organization.service";
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-bulk-repayment-download',
  templateUrl: './bulk-repayment-download.component.html',
  styleUrls: ['./bulk-repayment-download.component.scss']
})
export class BulkRepaymentDownloadComponent implements OnInit {
  /** Countries data */
  countriesData: any;
  countriesDataSliced: any;
   /** Repayment download form. */
   repaymentDownloadForm: FormGroup;
 
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService, 
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.createRepaymentDownloadForm();
  }

   /**
   * Creates the bulk import form.
   */
   createRepaymentDownloadForm() {
    this.repaymentDownloadForm = this.formBuilder.group({
      countryId: [""],
      repaymentsDate: [""],
    });
  }

  /**
   * Retrieves the list of countries.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  getCountries() {
    this.organizationService.getCountries().subscribe((response: any) => {
      this.countriesData = response;
      this.countriesDataSliced = this.countriesData;
    });
  }


  /**
   * Checks if a country is filtered.
   *
   * @param {any} country - The country to check.
   * @return {boolean} Returns true if the country is filtered, false otherwise.
   */
  public isFiltered(country: any) {
    return this.countriesDataSliced.find((item) => item.id === country.id);
  }


  /**
   * Downloads the repayment file based on the selected country and date.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  downloadRepaymentDownload() {
    const locale = this.settingsService.language.code;
    const repaymentDownloadFormValue = this.repaymentDownloadForm.value;
    const countryId = repaymentDownloadFormValue.countryId;
    let repaymentsDate = repaymentDownloadFormValue.repaymentsDate;

    if(repaymentsDate && countryId){
      const date = new Date(repaymentsDate);
      repaymentsDate = date.toLocaleDateString(locale, {month: "2-digit", day: "2-digit", year: "numeric"});
      const urlSuffix = '/clients/repayments/export?countryId=' + countryId + '&repaymentsDate=' + repaymentsDate;

      this.organizationService.downloadOutputTemplate(urlSuffix).subscribe((res: any) => {
        const contentType = res.headers.get("Content-Type");
        const blob = new Blob([res.body], { type: contentType });
        const fileOfBlob = new File([blob],"", { type: contentType });
        window.open(window.URL.createObjectURL(fileOfBlob));
      });
    }


  }
}
