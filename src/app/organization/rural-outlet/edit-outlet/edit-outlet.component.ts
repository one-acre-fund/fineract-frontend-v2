import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'app/organization/organization.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-edit-outlet',
  templateUrl: './edit-outlet.component.html',
  styleUrls: ['./edit-outlet.component.scss']
})
export class EditOutletComponent implements OnInit {

  retailOutletData: any;
  outletForm: FormGroup;
  listCountries: any = [];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private organizationService: OrganizationService,private router: Router,
    private settingsService: SettingsService,private dateUtils: Dates) {
    let outletId= +this.route.snapshot.paramMap.get('id');
    this.organizationService.getRuralOutletByOutletId(outletId).subscribe((res) => {
      this.retailOutletData=res;
      this.createOutletForm();
    });
   }

  ngOnInit(): void {
    this.getCountries();
    this.outletForm = this.formBuilder.group({
      countryId: '',
      name: ['', Validators.required],
      openingDate : '',
      externalId: '',
      offices:''
    })

  }

  createOutletForm() {
    this.outletForm.patchValue({
      countryId: this.retailOutletData.countryId,
      name: this.retailOutletData.name,
      openingDate: new Date(this.retailOutletData.openingDate),
      externalId: this.retailOutletData.externalId,
      offices: []
    });
  }

  getCountries(){
    this.organizationService.getCountries()
    .subscribe(res=>{
        this.listCountries = res;
    })
  }

  submit(){
    let outletId= +this.route.snapshot.paramMap.get('id');
    const outletFormData = this.outletForm.value;

    const data = {
      ...outletFormData
    };

    if (!data.externalId) {
      delete data.externalId;
    }
    if (data.openingDate) {
      delete data.openingDate;
    }
    this.organizationService.updateOutlet(outletId, data)
    .subscribe(resp => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }
}
