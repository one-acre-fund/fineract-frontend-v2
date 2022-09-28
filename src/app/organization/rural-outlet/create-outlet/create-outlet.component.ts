import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from 'app/organization/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-create-outlet',
  templateUrl: './create-outlet.component.html',
  styleUrls: ['./create-outlet.component.scss']
})
export class CreateOutletComponent implements OnInit {
  date = new FormControl(new Date());
  listCountries: any = [];
  outletForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private organizationService: OrganizationService,
    private router: Router, private route: ActivatedRoute,
    private settingsService: SettingsService,private dateUtils: Dates) {

   }

  ngOnInit(): void {
    this.getCountries();
    this.outletForm = this.formBuilder.group({
      countryId: '',
      name: ['', Validators.required],
      openingDate : '',
      externalId: '',
      offices:[]
    })
  }

  getCountries(){
    this.organizationService.getCountries()
    .subscribe(res=>{
        this.listCountries = res;
    })
  }

  submit(){
    const outletFormData = this.outletForm.value;

    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevOpenedOn: Date = this.outletForm.value.openingDate;
    if (outletFormData.openingDate instanceof Date) {
      outletFormData.openingDate = this.dateUtils.formatDate(prevOpenedOn, dateFormat);
    }

    const data = {
      ...outletFormData,
      dateFormat,
      locale
    };

    this.organizationService.createOutlet(data)
    .subscribe(resp => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }


}


