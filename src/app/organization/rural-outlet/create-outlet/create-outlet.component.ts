import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from 'app/organization/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

@Component({
  selector: 'mifosx-create-outlet',
  templateUrl: './create-outlet.component.html',
  styleUrls: ['./create-outlet.component.scss'],
})
export class CreateOutletComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private dateUtils: Dates
  ) {}
  date = new FormControl(new Date());
  listCountries: any = [];
  outletForm: FormGroup;
  treeDataSource: any = [];
  selectedOffices: any = [];

  ngOnInit(): void {
    this.getCountries();
    this.outletForm = this.formBuilder.group({
      countryId: '',
      name: ['', Validators.required],
      openingDate: '',
      externalId: '',
      offices: [],
    });
  }

  getCountries() {
    this.organizationService.getCountries().subscribe((res) => {
      this.listCountries = res;
    });
  }

  search(event: any) {
    const countryId = event.value;
    this.organizationService.searchCountryById(countryId).subscribe((res: any) => {
      const data = res
        .filter((x) => x.status === true)
        .map((item: any) => ({
          name: item.name,
          id: item.id,
          parentId: item.parentId,
          checked: false,
        }));
      this.treeDataSource = this.flatToHierarchy(data);
    });
  }

  flatToHierarchy(list: any) {
    let map = {},
      node,
      roots = [],
      i;

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
  submit() {
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
      locale,
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
    this.organizationService.createOutlet(data).subscribe((resp) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
