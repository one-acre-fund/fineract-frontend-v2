import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgModel } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "app/core/alert/alert.service";
import { SystemService } from "app/system/system.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "mifosx-data-fields",
  templateUrl: "./data-fields.component.html",
  styleUrls: ["./data-fields.component.scss"],
})
export class DataFieldsComponent implements OnInit {
  codes: any = [];
  countryId: any;
  type: any;
  baseData: any;
  subModuleFields: any;
  subModule: any;
  subModuleFiltered: any;
  fieldConfigurationId: any;
  dataSource: any;
  updatedFieldsData: any = [];
  datatableName: any;
  fieldName: any;

  columnType: any;
  columnTypeList: any[] = [
    { name: "String" },
    { name: "Number" },
    { name: "Decimal" },
    { name: "Boolean" },
    { name: "Date" },
    { name: "DateTime" },
    { name: "Text" },
    { name: "Dropdown" },
  ];
  columnTypeListFiltered: any = [];

  displayedColumns = ["field", "isEnabled", "isMandatory", "isUnique", "actions"];
  addDisplayedColumns = ["name", "type", "mandatory", "isUnique", "length", "code", "actions"];

  addDataSource = new BehaviorSubject<AbstractControl[]>([]);
  rows: FormArray = this.fb.array([]);
  form: FormGroup = this.fb.group({ tableArray: this.rows });
  @ViewChild(NgModel, { static: true }) addField: NgModel;
  toggleMatTable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private systemService: SystemService,
    private router: Router,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.route.data.subscribe((data: { columnCodes: any }) => {
      this.codes = data.columnCodes;
    });

    this.route.paramMap.subscribe((paramMap) => {
      this.countryId = paramMap.get("countryId");
      this.type = paramMap.get("id");
    });
  }

  ngOnInit(): void {
    this.columnTypeListFiltered = this.columnTypeList;
    this.getFieldConfigurationByType();
    this.getFieldBaseData();
  }

  getFieldConfigurationByType() {
    this.systemService.getFieldConfigurationByType(this.type, this.countryId).subscribe((res: any) => {
      this.subModuleFields = res;
      let temp = res.filter((value, index, self) => index === self.findIndex((t) => t.subentity === value.subentity));
      this.subModule = temp;
      this.subModuleFiltered = temp;
      this.fieldConfigurationId = temp[0];
      this.selectedSubModule(this.fieldConfigurationId?.subentity);
    });
  }

  getFieldBaseData() {
    this.systemService.getFieldConfigurationBasedata().subscribe((res: any) => {
      this.baseData = res;
    });
  }

  public isFiltered(field: any) {
    if (field && field.fieldConfigurationId)
      return this.subModuleFiltered.find((item) => item.fieldConfigurationId === field.fieldConfigurationId);
  }

  public filterColumnType(field: any) {
    if (field && field.name && this.columnTypeListFiltered) {
      return this.columnTypeListFiltered.find((item) => item.name === field.name);
    } else {
      return this.columnTypeList.find((item) => item.name === field.name);
    }
  }

  subEntity: any;
  selectedSubModule(subEntity: any) {
    this.subEntity = subEntity;
    this.datatableName = "m_field_" + subEntity.toLowerCase() + "_" + this.type.charAt(0).toLowerCase();
    if (subEntity && this.subModule.length > 0) {
      this.updatedFieldsData = this.subModuleFields.filter((i) => i.subentity === subEntity);
    }
  }

  addControl() {
    if (this.fieldName && this.columnType) {
      this.toggleMatTable = true;
      const row = this.fb.group({
        name: [this.fieldName],
        type: [this.columnType],
        mandatory: [false],
        isUnique: [false],
        length: new FormControl({ value: null, disabled: this.columnType !== "String" }),
        code: new FormControl({ value: null, disabled: this.columnType !== "Dropdown" }),
        subEntity: this.subEntity,
        entity: this.type,
      });
      this.rows.push(row);
      this.updateView();
      this.fieldName = null;
      this.columnType = null;
      this.addField.control.clearValidators();
    } else {
      this.toggleMatTable = false;
    }
  }

  updateView() {
    this.addDataSource.next(this.rows.controls);
  }

  removeNode(index: number, flag = false) {
    const control = this.form.get("tableArray") as FormArray;
    control.removeAt(index);
    this.updateView();
  }

  changeType(index: number, value: any) {
    const controls = this.form.get("tableArray") as FormArray;
    if (controls) {
      let control: any = controls.controls[index];
      control.value.type = value;
      if (value !== "String") {
        control.controls["length"].disable();
      } else {
        control.controls["length"].enable();
      }

      if (value !== "Dropdown") {
        control.controls["code"].disable();
      } else {
        control.controls["code"].enable();
      }
    }
    this.updateView();
  }

  saveControls() {
    let value = this.form.get("tableArray").value;

    let appTableName=this.type.toLowerCase();
    if(this.type.toLowerCase()==='loantype'){
      appTableName='loan';
    }
    else if(this.type.toLowerCase()==='ou'){
      appTableName='office';
    }

    let model = {
      apptableName: `m_${appTableName}`,
      datatableName: this.datatableName,
      officeCountryId: this.countryId,
      addColumns:value
    };

    this.systemService.saveFieldConfiguration(model).subscribe(
      (res: any) => {
        this.rows.clear();
        this.getFieldConfigurationByType();
        this.toggleMatTable = false;
      },
      (err) => {
        let errorMessage=err?.error?.error;
        if(err?.error?.errors){
          errorMessage=err?.error?.errors[0]?.developerMessage;
        }
        this.alertService.alert({
          type: "Error while saving data",
          message: errorMessage,
        });
      }
    );
  }

  updateControl(value: any) {
    let model = {
      apptableName: `m_${this.type.toLowerCase()}`,
      datatableName: this.datatableName,
      field: value.field,
      isEnabled: value.isEnabled,
      isMandatory: value.isMandatory,
      isUnique: value.isUnique,
    };
    this.systemService
      .updateFieldConfiguration(model, value.fieldConfigurationId, this.countryId)
      .subscribe((res: any) => {
        this.getFieldConfigurationByType();
        this.toggleMatTable = false;
      });
  }

  deleteRecord(field: any, fieldConfigurationId: any) {
    let model = {
      apptableName: `m_${this.type.toLowerCase()}`,
      datatableName: this.datatableName,
    };
    this.systemService.deleteConfiguration(fieldConfigurationId, model).subscribe((res: any) => {
      this.getFieldConfigurationByType();
      this.toggleMatTable = false;
    });
  }

  goBack() {
    this.rows.clear();
    this.toggleMatTable = false;
  }
}
