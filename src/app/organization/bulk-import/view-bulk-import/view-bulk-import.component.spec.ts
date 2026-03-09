import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ViewBulkImportComponent } from './view-bulk-import.component';
import { OrganizationService } from '../../organization.service';
import { ClientsService } from 'app/clients/clients.service';
import { AlertService } from 'app/core/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

describe('ViewBulkImportComponent', () => {
  let component: ViewBulkImportComponent;
  let fixture: ComponentFixture<ViewBulkImportComponent>;
  let organizationService: jasmine.SpyObj<OrganizationService>;

  beforeEach(async(() => {
    const offices = [
      { id: 1, name: 'Region', isLowestOU: false },
      { id: 2, name: 'Branch', isLowestOU: true },
    ];

    organizationService = jasmine.createSpyObj<OrganizationService>('OrganizationService', ['fetchByHierarchyLevel', 'getStaff']);
    organizationService.getStaff.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ViewBulkImportComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { 'import-name': 'Savings Transactions' } },
            data: of({ offices, imports: [], countries: [] }),
          },
        },
        { provide: OrganizationService, useValue: organizationService },
        { provide: ClientsService, useValue: { getClientCommandTemplateForBulkImport: () => of({ officeOptions: [] }) } },
        { provide: AlertService, useValue: { alert: () => {} } },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
    })
    // Unit tests for component class behavior only; avoid template dependencies (pipes, directives, material, etc.)
    .overrideTemplate(ViewBulkImportComponent, '')
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBulkImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create child levels when selected office is lowest OU', () => {
    component.bulkImportForm.get('officeId').setValue(2);
    component.onOfficeChange({ id: 2 });

    expect(component.selectedOffice?.id).toBe(2);
    expect(component.selectedOffice?.isLowestOU).toBe(true);
    expect(component.officeChainLevels.length).toBe(0);
    expect(component.childOfficeLevelsFormArray.length).toBe(0);
    expect(organizationService.fetchByHierarchyLevel).not.toHaveBeenCalled();
    expect(component.getEffectiveOfficeId()).toBe(2);
  });

  it('should fetch offices under selected office and create first child level when not lowest OU', () => {
    organizationService.fetchByHierarchyLevel.and.returnValue(
      of([
        { id: 10, name: 'Child A', status: true, isLowestOU: true },
        { id: 99, name: 'Inactive', status: false, isLowestOU: true },
      ])
    );

    component.bulkImportForm.get('officeId').setValue(1);
    component.onOfficeChange({ id: 1 });

    expect(component.selectedOffice?.id).toBe(1);
    expect(component.selectedOffice?.isLowestOU).toBe(false);
    expect(organizationService.fetchByHierarchyLevel).toHaveBeenCalledWith(1, 'LOWER');

    expect(component.officeChainLevels.length).toBe(1);
    expect(component.officeChainLevels[0].parentName).toBe('Region');
    expect(component.officeChainLevels[0].options.length).toBe(1);
    expect(component.officeChainLevels[0].options[0].id).toBe(10);

    expect(component.childOfficeLevelsFormArray.length).toBe(1);
    expect(component.childOfficeLevelsFormArray.at(0).invalid).toBe(true);
    expect(component.getEffectiveOfficeId()).toBeNull();
  });

  it('should append another select level until isLowestOU is true', () => {
    organizationService.fetchByHierarchyLevel.and.callFake((officeId: number, level: string) => {
      if (officeId === 1 && level === 'LOWER') {
        return of([{ id: 10, name: 'Child A', status: true, isLowestOU: false }]);
      }
      if (officeId === 10 && level === 'LOWER') {
        return of([{ id: 11, name: 'Grandchild', status: true, isLowestOU: true }]);
      }
      return of([]);
    });

    component.bulkImportForm.get('officeId').setValue(1);
    component.onOfficeChange({ id: 1 });
    expect(component.officeChainLevels.length).toBe(1);
    expect(component.childOfficeLevelsFormArray.length).toBe(1);

    // choose non-lowest at level 0 -> should add level 1
    component.childOfficeLevelsFormArray.at(0).setValue(10);
    component.onChildOfficeChange(0, { id: 10, name: 'Child A', isLowestOU: false });
    expect(organizationService.fetchByHierarchyLevel).toHaveBeenCalledWith(10, 'LOWER');
    expect(component.officeChainLevels.length).toBe(2);
    expect(component.childOfficeLevelsFormArray.length).toBe(2);

    // choose lowest at level 1 -> should NOT add more
    component.childOfficeLevelsFormArray.at(1).setValue(11);
    component.onChildOfficeChange(1, { id: 11, name: 'Grandchild', isLowestOU: true });
    expect(component.officeChainLevels.length).toBe(2);
    expect(component.childOfficeLevelsFormArray.length).toBe(2);

    expect(component.getEffectiveOfficeId()).toBe(11);
  });

  it('should truncate deeper levels when changing an earlier selection', () => {
    organizationService.fetchByHierarchyLevel.and.callFake((officeId: number, level: string) => {
      if (officeId === 1 && level === 'LOWER') {
        return of([{ id: 10, name: 'Child A', status: true, isLowestOU: false }]);
      }
      if (officeId === 10 && level === 'LOWER') {
        return of([{ id: 11, name: 'Grandchild', status: true, isLowestOU: true }]);
      }
      return of([]);
    });

    component.bulkImportForm.get('officeId').setValue(1);
    component.onOfficeChange({ id: 1 });
    component.childOfficeLevelsFormArray.at(0).setValue(10);
    component.onChildOfficeChange(0, { id: 10, name: 'Child A', isLowestOU: false });
    expect(component.officeChainLevels.length).toBe(2);
    expect(component.childOfficeLevelsFormArray.length).toBe(2);

    // change level 0 selection to a lowest office -> should drop level 1 and not fetch
    const callsBefore = organizationService.fetchByHierarchyLevel.calls.count();
    component.childOfficeLevelsFormArray.at(0).setValue(12);
    component.onChildOfficeChange(0, { id: 12, name: 'Child B', isLowestOU: true });

    expect(component.officeChainLevels.length).toBe(1);
    expect(component.childOfficeLevelsFormArray.length).toBe(1);
    expect(organizationService.fetchByHierarchyLevel.calls.count()).toBe(callsBefore);
  });
});
