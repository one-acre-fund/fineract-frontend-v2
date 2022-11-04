import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from 'app/organization/organization.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'mifosx-create-currencies',
  templateUrl: './create-currencies.component.html',
  styleUrls: ['./create-currencies.component.scss']
})
export class CreateCurrenciesComponent implements OnInit {

  /** Currency form. */
  currencyForm: FormGroup;
  currencyTemplateData: any;

  listCountries: any = [];
  countriesDataSliced: any = [];

  currency = new FormControl();
  filteredCurrency: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.data.subscribe((data: { currencies: any }) => {
      this.currencyTemplateData = data.currencies;
    });
    this.getCountries();
  }

  ngOnInit(): void {
    this.createCurrencyForm();
  }

  createCurrencyForm() {
    this.currencyForm = this.formBuilder.group({
      active: [false],
      countryId: ['', Validators.required],
      currencyCode: this.currency
    });
  }

  submit() {
    const currencyFormData = this.currencyForm.value;
    this.organizationService.createCurrencies(currencyFormData).subscribe((response: any) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  getCountries() {
    this.organizationService.getCountries().subscribe((res) => {
      this.listCountries = res;
      this.countriesDataSliced = res;
    });
  }

  isFiltered(country: any) {
    return this.countriesDataSliced.find((item) => item.id === country.id);
  }

}
