import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/core/alert/alert.service';
import { Dates } from 'app/core/utils/dates';
import { OrganizationService } from 'app/organization/organization.service';
import { SettingsService } from 'app/settings/settings.service';

@Component({
  selector: 'mifosx-split-office',
  templateUrl: './split-office.component.html',
  styleUrls: ['./split-office.component.scss'],
})
export class SplitOfficeComponent implements OnInit {
  /** Office Data */
  splitOffices: any;

  officeData: any;
  /** Office form. */
  splitOfficeForm: FormGroup;

  childOfficeData: any;

  parentOfficeData: any;
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Date allowed. */
  maxDate = new Date();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private settingsService: SettingsService,
    private dateUtils: Dates,
    private alertService: AlertService
  ) {
    this.route.data.subscribe((data: { offices: any }) => {
      this.officeData = data.offices.filter((x) => x.status === true);
      this.splitOffices = data.offices?.filter((x) => x.id !== 1 && x.status === true && x.parentId !== 1);
    });
  }

  ngOnInit(): void {
    this.createSplitOfficeForm();
  }

  createSplitOfficeForm() {
    this.splitOfficeForm = this.formBuilder.group({
      splitId: [null, Validators.required],
      firstOfficeChildIds: [null],
      secondOfficeChildIds: [null],
      firstParentId: [null, Validators.required],
      secondParentId: [null, Validators.required],
      firstOfficeName: [null, Validators.required],
      secondOfficeName: [null, Validators.required],
      firstOpeningDate: ['', Validators.required],
      secondOpeningDate: ['', Validators.required],
      firstExternalId: [null],
      secondExternalId: [null],
    });
  }

  filterChildOffices(event: any) {
    const officeId = +event.value;
    this.childOfficeData = this.officeData.filter((x) => x.status === true && x.parentId === officeId);
    // this.organizationService.fetchByHierarchyLevel(officeId,'SAME').subscribe((response) => {
    //   this.childOfficeData = response?.filter(x=>x?.status==true);
    // });
  }

  filterparentOffices(event: any) {
    const officeId = +event.value;
    const level = 'SAME';
    const splitOfficeParentId = this.officeData.find((el) => el.id === officeId).parentId;
    const parentOffice: any = this.officeData.find((el) => el.id === splitOfficeParentId);
    this.parentOfficeData = [];
    if (parentOffice?.isCountry === true) {
      this.parentOfficeData =
        parentOffice.parentId === 1
          ? [parentOffice]
          : this.officeData.filter((el) => el.parentId === parentOffice.parentId);
    } else {
      this.organizationService.fetchByHierarchyLevel(officeId, level).subscribe((response) => {
        this.parentOfficeData = response?.filter((x) => x?.status === true);
      });
    }
  }

  submit() {
    const officeFormData = this.splitOfficeForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const firstOpeningDate: Date = this.splitOfficeForm.value.firstOpeningDate;
    if (officeFormData.firstOpeningDate instanceof Date) {
      officeFormData.firstOpeningDate = this.dateUtils.formatDate(firstOpeningDate, dateFormat);
    }
    const secondOpeningDate: Date = this.splitOfficeForm.value.secondOpeningDate;
    if (officeFormData.secondOpeningDate instanceof Date) {
      officeFormData.secondOpeningDate = this.dateUtils.formatDate(secondOpeningDate, dateFormat);
    }
    const data = {
      ...officeFormData,
      dateFormat,
      locale,
    };
    if (!data.firstExternalId) {
      delete data.firstExternalId;
    }
    if (!data.secondExternalId) {
      delete data.secondExternalId;
    }
    this.organizationService.splitOffice(data).subscribe((response) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
