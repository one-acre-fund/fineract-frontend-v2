/** Angular Imports */
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

/** Custom Services */
import { ReportsService } from 'app/reports/reports.service';

/** Custom Models */
import { ReportParameter } from 'app/reports/common-models/report-parameter.model';
import { OrganizationService } from 'app/organization/organization.service';

/**
 * Edit SMS Campaign step.
 */
@Component({
  selector: 'mifosx-edit-sms-campaign-step',
  templateUrl: './edit-sms-campaign-step.component.html',
  styleUrls: ['./edit-sms-campaign-step.component.scss']
})
export class EditSmsCampaignStepComponent implements OnInit {

  /** SMS Campaign Template */
  @Input() smsCampaignTemplate: any;
  /** SMS Campaign */
  @Input() smsCampaign: any;

  /** SMS Campaign Form */
  smsCampaignDetailsForm: UntypedFormGroup;
  /** Data to be passed to sub component */
  paramData: any;
  /** Trigger types options */
  triggerTypes: any[];
  /** SMS providers options */
  smsProviders: any[];
  /** Business Rules options */
  businessRules: any[];
  /** Repetition Intervals */
  repetitionIntervals: any[];
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Date allowed. */
  maxDate = new Date();
  countryOptions = [];

  /** Template Parameters Event Emitter */
  @Output() templateParameters = new EventEmitter();

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {ReportsService} reportService Reports Service
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private reportService: ReportsService,
              private organizationService: OrganizationService
            ) {
    this.createSMSCampaignDetailsForm();
  }

  /**
   * Initializes the SMS campaign form.
   */
  createSMSCampaignDetailsForm() {
    this.smsCampaignDetailsForm = this.formBuilder.group({
      'countryId': ['', Validators.required],
      'campaignName': ['', Validators.required],
      'providerId': [null],
      'triggerType': ['', Validators.required],
      'runReportId': ['', Validators.required],
      'isNotification': [false]
    });
  }

  ngOnInit() {
    this.organizationService.getSmsCampaignTemplate(this.smsCampaign.country.id, this.smsCampaign.country.name).subscribe({
      next: (response: any) => {
        this.triggerTypes = response.triggerTypeOptions;
        this.smsProviders = response.smsProviderOptions;
        this.businessRules = response.businessRulesOptions;
      }
    });
    
    this.countryOptions = this.smsCampaignTemplate || [];
    this.setControlValues();
    this.getParameters();
  }

  /** 
   * Passes template parameters emitted from child to parent.
   * @param {any} $event Template Parameters
   */
  passParameters($event: any) {
    this.templateParameters.emit($event);
  }

  /**
   * Gets Template parameters and disables the SMS form.
   */
  getParameters() {
    this.reportService.getReportParams(this.smsCampaign.reportName).subscribe((response: ReportParameter[]) => {
      this.paramData = response;
    });
    this.smsCampaignDetailsForm.disable();
  }

  /**
   * Patches all control values as in API response.
   */
  setControlValues() {
    this.smsCampaignDetailsForm.patchValue({
      'campaignName': this.smsCampaign.campaignName,
      'providerId': this.smsCampaign.providerId,
      'triggerType': this.smsCampaign.triggerType.id,
      'runReportId': this.smsCampaign.runReportId,
      'isNotification': this.smsCampaign.isNotification,
      'countryId': this.smsCampaign.country?.id,
    });
    if (this.smsCampaign.triggerType.value === 'Schedule') {
      this.smsCampaignDetailsForm.addControl('recurrenceStartDate', new UntypedFormControl(new Date(this.smsCampaign.recurrenceStartDate)));
    }
  }

}
