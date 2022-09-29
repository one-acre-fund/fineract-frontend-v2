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
  treeDataSource: any;
  selectedOffices: any = [];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private organizationService: OrganizationService, private router: Router,
    private settingsService: SettingsService, private dateUtils: Dates) {
    const outletId = +this.route.snapshot.paramMap.get('id');
    this.organizationService.getRuralOutletByOutletId(outletId).subscribe((res: any) => {
      this.retailOutletData = res;
      this.search(res.countryId);
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
      offices: ''
    });

  }

  getCountries() {
    this.organizationService.getCountries()
    .subscribe(res => {
        this.listCountries = res;
    });
  }

  search(countryId: number) {
    this.organizationService.searchCountryById(countryId)
    .subscribe((res: any) => {
      const data = res
      .filter(x => x.status === true)
      .map((item: any) => ({
        name: item.name,
        id: item.id,
        parentId: item.parentId
      }));
      this.treeDataSource = this.flatToHierarchy(data);
    });
  }

  flatToHierarchy ( list: any ) {
    let map = {}, node, roots = [], i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== 1) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
  }


  getCheckedOffices(event: any) {
    this.selectedOffices = event;
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

  submit() {
    const outletId = +this.route.snapshot.paramMap.get('id');
    const outletFormData = this.outletForm.value;

    const data = {
      ...outletFormData
    };

    if (this.selectedOffices && this.selectedOffices.length > 0) {
      const offices = this.selectedOffices.map((x) => {
        const officeId = {officeId: x.id};
        return officeId;
      });
      data.offices = offices;
    }

    if (!data.externalId) {
      delete data.externalId;
    }
    if (data.openingDate) {
      delete data.openingDate;
    }
    this.organizationService.updateOutlet(outletId, data)
    .subscribe(resp => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
