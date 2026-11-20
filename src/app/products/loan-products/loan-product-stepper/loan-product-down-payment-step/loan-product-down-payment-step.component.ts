import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subject, merge, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';

import DataFlattner from 'app/core/utils/data-flattner';
import { Dates } from 'app/core/utils/dates';
import { OrganizationService } from 'app/organization/organization.service';
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';

import { DownPaymentDateAdapter } from '../../down-payment/down-payment-configuration.models';
import { DownPaymentFormStore } from '../../down-payment/down-payment-form.store';

/**
 * The down payment configurations of a loan product. The step is only shown for the CONFIGURED down payment strategy,
 * which is itself only offered in a country whose loans need the client to qualify by paying a down payment.
 */
@Component({
  selector: 'mifosx-loan-product-down-payment-step',
  templateUrl: './loan-product-down-payment-step.component.html',
  styleUrls: ['./loan-product-down-payment-step.component.scss'],
  providers: [DownPaymentFormStore],
})
export class LoanProductDownPaymentStepComponent implements OnInit, OnDestroy {
  @Input() loanProductsTemplate: any;

  private destroy$ = new Subject<void>();

  constructor(
    public store: DownPaymentFormStore,
    private productsService: ProductsService,
    private organizationService: OrganizationService,
    private dateUtils: Dates,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.store.setProductCountry(this.loanProductsTemplate?.countryId);
    this.store.load(this.loanProductsTemplate?.downPaymentConfigurations, this.dates);
    this.store.setPrincipalRange(this.loanProductsTemplate?.minPrincipal, this.loanProductsTemplate?.maxPrincipal);

    // the bands have to cover every principal the product allows, so they are checked again when those limits change
    this.productsService.principalRange.pipe(takeUntil(this.destroy$)).subscribe((range: any) => {
      this.store.setPrincipalRange(range?.minPrincipal, range?.maxPrincipal);
    });

    // the product's country on an edit, or the one just chosen on the organisation unit step
    merge(of(this.loanProductsTemplate?.countryId), this.productsService.countryId)
      .pipe(
        filter((countryId: any) => !!countryId),
        distinctUntilChanged(),
        // the whole hierarchy, not only up to the configured OU level: a saved configuration may reach deeper, and
        // an office missing from the tree could neither be seen nor kept
        switchMap((countryId: any) =>
          this.organizationService
            .searchCountryById(countryId, false)
            .pipe(catchError(() => of([])), map((offices: any[]) => ({ countryId, offices })))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((loaded: any) => this.store.setOfficeTree(toOfficeTree(loaded.offices), loaded.countryId));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** The form the stepper watches, so an incomplete configuration blocks the step */
  get loanProductDownPaymentForm(): UntypedFormGroup {
    return this.store.form;
  }

  /** What the loan product request carries */
  get loanProductDownPayment(): any {
    return { downPaymentConfigurations: this.store.toRequest(this.dates) };
  }

  /** The configurations as the read only preview shows them */
  get summary(): any[] {
    return this.store.toDisplay();
  }

  get pristine(): boolean {
    return this.store.form.pristine;
  }

  /** Reads the API's ISO dates and writes dates back in the format the request declares */
  private get dates(): DownPaymentDateAdapter {
    return {
      parse: (isoDate: string) => this.dateUtils.parseDate(isoDate),
      format: (date: Date) => this.dateUtils.formatDate(date, this.settingsService.dateFormat),
    };
  }
}

/** The active offices of a country as the tree component takes them */
function toOfficeTree(offices: any[]): any[] {
  const nodes = (offices || [])
    .filter((office: any) => office.status === true)
    .map((office: any) => ({ name: office.name, id: office.id, parentId: office.parentId, checked: false }));
  return DataFlattner.flatToHierarchy(nodes);
}
