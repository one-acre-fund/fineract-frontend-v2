/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

/** Custom Services */
import { OrganizationService } from '../../organization.service'
import { SettingsService } from 'app/settings/settings.service'
import { Dates } from 'app/core/utils/dates'
import { OfficeHierarchy } from 'app/shared/office-tree-view/office-tree-node'

/**
 * Create Office component.
 */
@Component({
  selector: 'mifosx-create-office',
  templateUrl: './create-office.component.html',
  styleUrls: ['./create-office.component.scss']
})
export class CreateOfficeComponent implements OnInit {
  /** Office form. */
  officeForm: FormGroup
  /** Office Data */
  officeData: any
  /** Minimum Date allowed. */
  minDate = new Date(2000, 0, 1)
  /** Maximum Date allowed. */
  maxDate = new Date()

  parentId: number
  /**
   * Retrieves the offices data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {OrganizationService} organizationService Organization Service.
   * @param {SettingsService} settingsService Settings Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {Dates} dateUtils Date Utils to format date.
   */
  constructor (
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private dateUtils: Dates
  ) {
    this.route.data.subscribe((data: { offices: any }) => {
      this.officeData = data.offices
    })
    this.parentId = this.router.getCurrentNavigation().extras.state.id
  }
  choices: any = [
    { id: 1, tag: 'Yes' },
    { id: 2, tag: 'No' }
  ]
  showHierarchy: boolean = false
  @ViewChild('officeHierarchy') officeHierarchy;
  ngOnInit () {
    this.createofficeForm()
  }

  /**
   * Creates the Office Form
   */
  createofficeForm () {
    this.officeForm = this.formBuilder.group({
      name: ['', Validators.required],
      parentId: [this.parentId, Validators.required],
      openingDate: ['', Validators.required],
      externalId: [''],
      countryHierarchy:[],
      country:[true]
    })
  }

  convertArrayToObject(dataArray:any){
    dataArray.reduce((obj,item)=>(obj[item.key]=item.value,obj),{})
    dataArray.forEach(element => {
        
    });
    if(Array.isArray(dataArray))
      return Object.assign({},dataArray)
  }
  /**
   * Submits the office form and creates office.
   * if successful redirects to offices
   */
  submit () {
    let hierarchyData=this.officeHierarchy?._database.data;
    if(hierarchyData && hierarchyData.length>0 && this.showHierarchy){
      let dataArray=[];
   hierarchyData.forEach(element => {
        if(element.descendant.length<=0)
            delete element.descendant
            else
            element.descendant=Object.assign({},element.descendant)
            dataArray.push(element)
      });
      let dt=Object.assign({},dataArray[0])
      this.officeForm.patchValue({
        countryHierarchy:dt
      })
    }
    const officeFormData = this.officeForm.value
    const locale = this.settingsService.language.code
    const dateFormat = this.settingsService.dateFormat
    const prevOpeningDate: Date = this.officeForm.value.openingDate
    if (officeFormData.openingDate instanceof Date) {
      officeFormData.openingDate = this.dateUtils.formatDate(prevOpeningDate, dateFormat)
    }   
    const data = {
      ...officeFormData,
      dateFormat,
      locale
    }
    if(this.showHierarchy){
      data.country=data.country=="Yes"?'true':'false';
      this.organizationService.createOfficeHierarchy(data).subscribe(response => {
        this.router.navigate(['../'], { relativeTo: this.route })
      })
    }else{
      delete officeFormData.country
      delete data.countryHierarchy
      this.organizationService.createOffice(data).subscribe(response => {
        this.router.navigate(['../'], { relativeTo: this.route })
      })
    }   
  }
}
