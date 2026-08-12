import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationService } from 'app/organization/organization.service';
import { SettingsService } from 'app/settings/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Emitted whenever the region, district or site selection changes.
 */
export interface SiteSelectorChange {
  regionId: number | null;
  regionName: string | null;
  districtId: number | null;
  districtName: string | null;
  siteIds: number[] | null;
  firstLevelLabel?: string;
  secondLevelLabel?: string;
}

/**
 * Site Selector Component.
 *
 * Displays Region, District and Site (optional, defaults to "All Sites") cascading set of dropdowns
 *
 * The component walks the office hierarchy using
 * `OrganizationService.fetchByHierarchyLevel` starting from the country/root
 * office supplied via `countryId`, populating the Region dropdown,
 * then the District dropdown (children of the selected Region) and finally
 * the Site dropdown (children of the selected District). The Site dropdown
 * includes an "All Sites" option which is selected by default.
 */
@Component({
  selector: 'mifosx-site-selector',
  templateUrl: './site-selector.component.html',
  styleUrls: ['./site-selector.component.scss'],
})
export class SiteSelectorComponent implements OnInit, OnChanges, OnDestroy {
  /** Root/country office id to fetch regions from. */
  @Input() countryId: number | null = null;

  /** Emits the current region/district/site selection whenever it changes. */
  @Output() selectionChange = new EventEmitter<SiteSelectorChange>();

  siteSelectorForm: UntypedFormGroup;

  regionOptions: any[] = [];
  districtOptions: any[] = [];
  siteOptions: any[] = [];
  allCountryOffices: any[] = [];

  firstLevelLabel = 'Region';
  secondLevelLabel = 'District';
  thirdLevelLabel = 'Site';

  private levelHierarchyIds: number[] = [];

  /** Sentinel value representing the "All Sites" option (no specific sites selected). */
  readonly ALL_SITES: number[] | null = null;

  /** Sentinel id for the "All Sites" dropdown option. */
  readonly ALL_SITES_OPTION_ID = -1;

  /** Site options for the dropdown, prefixed with an "All Sites" option when sites exist. */
  siteDropdownOptions: any[] = [];

  /** Completes on destroy to tear down subscriptions. */
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private organizationService: OrganizationService,
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {
    this.siteSelectorForm = this.formBuilder.group({
      regionId: [null],
      districtId: [null],
      siteIds: [this.ALL_SITES],
    });
  }

  ngOnInit(): void {
    if (!this.countryId) {
      this.countryId = this.settingsService.getSelectedCountry()?.id ?? null;
    }
    if (this.countryId) {
      this.loadCountryOffices();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryId'] && !changes['countryId'].firstChange) {
      this.resetForm();
      this.loadCountryOffices();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resetForm(): void {
    this.allCountryOffices = [];
    this.regionOptions = [];
    this.districtOptions = [];
    this.siteOptions = [];
    this.siteDropdownOptions = [];
    this.firstLevelLabel = 'Region';
    this.secondLevelLabel = 'District';
    this.thirdLevelLabel = 'Site';
    this.levelHierarchyIds = [];
    this.siteSelectorForm.reset({ regionId: null, districtId: null, siteIds: this.ALL_SITES });
    this.emitSelection();
  }

  private loadCountryOffices(): void {
    if (!this.countryId) {
      return;
    }
    this.organizationService
      .getOfficesByCountry(this.countryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any[]) => {
        this.allCountryOffices = (response || []).filter((office: any) => office.status === true);
        this.initializeHierarchyLevels();
        this.regionOptions = this.getOfficesByHierarchyLevel(this.levelHierarchyIds[0]);
        this.emitSelection();
      });
  }

  onRegionChange(region: any): void {
    this.districtOptions = [];
    this.siteOptions = [];
    this.siteDropdownOptions = [];
    this.siteSelectorForm.patchValue({ districtId: null, siteIds: this.ALL_SITES });

    const selectedRegionId = typeof region === 'object' ? region?.id : region;
    this.districtOptions = this.getChildOffices(selectedRegionId, this.levelHierarchyIds[1]);
    this.emitSelection();
  }

  onDistrictChange(district: any): void {
    this.siteOptions = [];
    this.siteDropdownOptions = [];
    this.siteSelectorForm.patchValue({ siteIds: this.ALL_SITES });

    const selectedDistrictId = typeof district === 'object' ? district?.id : district;
    this.siteOptions = this.getChildOffices(selectedDistrictId, this.levelHierarchyIds[2]);
    this.siteDropdownOptions = this.siteOptions.length
      ? [
          { id: this.ALL_SITES_OPTION_ID, name: this.getAllLowestLevelLabel() },
          ...this.siteOptions,
        ]
      : [];
    this.siteSelectorForm.patchValue(
      { siteIds: this.siteOptions.map((site: any) => site.id) },
      { emitEvent: false }
    );
    this.emitSelection();
  }

  onSiteChange(): void {
    const siteIds: number[] = this.siteSelectorForm.value.siteIds || [];
    if (siteIds.includes(this.ALL_SITES_OPTION_ID)) {
      const selectedSiteIds = siteIds.filter((id: number) => id !== this.ALL_SITES_OPTION_ID);
      const allAlreadySelected =
        this.siteOptions.length > 0 && this.siteOptions.every((site: any) => selectedSiteIds.includes(site.id));
      if (allAlreadySelected) {
        // "All Sites" clicked while everything was selected: deselect all.
        this.siteSelectorForm.patchValue({ siteIds: this.ALL_SITES }, { emitEvent: false });
      } else {
        // "All Sites" selected: mark every available site as selected.
        this.siteSelectorForm.patchValue(
          { siteIds: this.siteOptions.map((site: any) => site.id) },
          { emitEvent: false }
        );
      }
    }
    this.emitSelection();
  }

  /** Site option objects for the currently selected site ids. */
  get selectedSites(): any[] {
    const siteIds: number[] = this.siteSelectorForm.value.siteIds || [];
    return this.siteOptions.filter((site: any) => siteIds.includes(site.id));
  }

  /** Removes a single site from the current selection. */
  removeSite(siteId: number): void {
    const siteIds: number[] = this.siteSelectorForm.value.siteIds || [];
    const updated = siteIds.filter((id: number) => id !== siteId);
    this.siteSelectorForm.patchValue({ siteIds: updated.length ? updated : this.ALL_SITES });
    this.emitSelection();
  }

  get firstLevelPlaceholder(): string {
    return `Select ${this.firstLevelLabel}`;
  }

  get secondLevelPlaceholder(): string {
    return `Select ${this.secondLevelLabel}`;
  }

  get thirdLevelPlaceholder(): string {
    return `Select ${this.thirdLevelLabel}`;
  }

  private initializeHierarchyLevels(): void {
    const hierarchyIds = this.allCountryOffices
      .map((office: any) => office.officeCountryHierarchyId)
      .filter((id: any) => typeof id === 'number' && id > 0);

    const uniqueSorted = Array.from(new Set(hierarchyIds)).sort((a: number, b: number) => a - b);
    this.levelHierarchyIds = uniqueSorted.slice(-3);

    this.firstLevelLabel = this.getLevelLabel(this.levelHierarchyIds[0], 'Region');
    this.secondLevelLabel = this.getLevelLabel(this.levelHierarchyIds[1], 'District');
    this.thirdLevelLabel = this.getLevelLabel(this.levelHierarchyIds[2], 'Site');
  }

  private getLevelLabel(levelId: number | undefined, fallback: string): string {
    if (levelId === undefined) {
      return fallback;
    }
    const match = this.allCountryOffices.find((office: any) => office.officeCountryHierarchyId === levelId);
    return match?.officeCountryHierarchyLevelName || fallback;
  }

  private getOfficesByHierarchyLevel(levelId: number | undefined): any[] {
    if (levelId === undefined) {
      return [];
    }
    return this.allCountryOffices.filter((office: any) => office.officeCountryHierarchyId === levelId);
  }

  private getChildOffices(parentId: number | null, levelId: number | undefined): any[] {
    if (!parentId || levelId === undefined) {
      return [];
    }
    return this.allCountryOffices.filter(
      (office: any) => office.officeCountryHierarchyId === levelId && office.parentId === parentId
    );
  }

  private getAllLowestLevelLabel(): string {
    const label = this.thirdLevelLabel || this.translateService.instant('labels.oaf.AllSites');
    return label.endsWith('s') ? `All ${label}` : `All ${label}s`;
  }

  private emitSelection(): void {
    const value = this.siteSelectorForm.value;
    const region = this.regionOptions.find((office: any) => office.id === value.regionId);
    const district = this.districtOptions.find((office: any) => office.id === value.districtId);
    this.selectionChange.emit({
      regionId: value.regionId ?? null,
      regionName: region?.name ?? null,
      districtId: value.districtId ?? null,
      districtName: district?.name ?? null,
      siteIds: value.siteIds?.length ? value.siteIds : null,
      firstLevelLabel: this.firstLevelLabel,
      secondLevelLabel: this.secondLevelLabel,
    });
  }
}
