import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SiteSelectorComponent } from './site-selector.component';
import { OrganizationService } from 'app/organization/organization.service';
import { SettingsService } from 'app/settings/settings.service';

describe('SiteSelectorComponent', () => {
  let component: SiteSelectorComponent;
  let fixture: ComponentFixture<SiteSelectorComponent>;
  let organizationService: jasmine.SpyObj<OrganizationService>;
  let settingsService: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    organizationService = jasmine.createSpyObj<OrganizationService>('OrganizationService', ['getOfficesByCountry']);
    organizationService.getOfficesByCountry.and.returnValue(
      of([
        { id: 101, name: 'District A', status: true, officeCountryHierarchyId: 10, officeCountryHierarchyLevelName: 'District' },
        { id: 201, name: 'Sector A', parentId: 101, status: true, officeCountryHierarchyId: 11, officeCountryHierarchyLevelName: 'Sector' },
        { id: 301, name: 'Site A', parentId: 201, status: true, officeCountryHierarchyId: 12, officeCountryHierarchyLevelName: 'Site' },
      ])
    );

    settingsService = jasmine.createSpyObj<SettingsService>('SettingsService', ['getSelectedCountry']);
    settingsService.getSelectedCountry.and.returnValue({ id: 1 } as any);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SiteSelectorComponent],
      providers: [
        { provide: OrganizationService, useValue: organizationService },
        { provide: SettingsService, useValue: settingsService },
      ],
    })
      .overrideTemplate(SiteSelectorComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load regions when countryId is set on init', () => {
    fixture.detectChanges();
    expect(organizationService.getOfficesByCountry).toHaveBeenCalledWith(1);
  });

  it('should load districts when a region is selected', () => {
    component.countryId = 1;
    fixture.detectChanges();
    component.onRegionChange(101);
    expect(component.districtOptions.length).toBe(1);
    expect(component.districtOptions[0].id).toBe(201);
  });

  it('should reset site selection to All Sites when district changes', () => {
    component.countryId = 1;
    fixture.detectChanges();
    component.onDistrictChange({ id: 10 });
    expect(component.siteSelectorForm.get('siteIds').value).toBeNull();
  });
});
