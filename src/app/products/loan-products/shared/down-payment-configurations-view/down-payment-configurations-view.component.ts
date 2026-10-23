import { Component, Input } from '@angular/core';

import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';

/**
 * Shows a loan product's down payment configurations read only, wherever the product is displayed rather than edited:
 * the preview of a product being created, the qualification rules of a saved one, and the qualification rules step.
 */
@Component({
  selector: 'mifosx-down-payment-configurations-view',
  templateUrl: './down-payment-configurations-view.component.html',
  styleUrls: ['./down-payment-configurations-view.component.scss'],
})
export class DownPaymentConfigurationsViewComponent {
  /** Configurations as the loan product API returns them, or as the down payment step summarises what was entered */
  @Input() configurations: any[];

  constructor(private dateUtils: Dates, private settingsService: SettingsService) {}

  get rows(): any[] {
    return (this.configurations || []).filter((configuration) => !configuration.markedForDeletion).map((configuration) => ({
      name: configuration.name,
      type: configuration.type,
      offices: (configuration.offices || []).map((office: any) => office.officeName).filter((name: string) => !!name),
      periods: (configuration.periods || [])
        .filter((period: any) => !period.markedForDeletion)
        .map((period: any) => ({
          label: this.periodLabel(period),
          bands: (period.bands || []).filter((band: any) => !band.markedForDeletion).map((band: any) => this.bandLabel(band)),
        })),
    }));
  }

  /** A STATIC configuration's only period has no dates: it covers all the time */
  private periodLabel(period: any): string {
    if (!period.fromDate && !period.toDate) {
      return null;
    }
    return `${this.date(period.fromDate)} - ${this.date(period.toDate)}`;
  }

  /** e.g. '0 - 10,000: 10%' or '10,001 and above: 1500' */
  private bandLabel(band: any): string {
    const range =
      band.maxPrincipal === null || band.maxPrincipal === undefined
        ? `${band.minPrincipal} +`
        : `${band.minPrincipal} - ${band.maxPrincipal}`;
    const amount = band.calculationType === 'PERCENTAGE' ? `${band.amount}%` : `${band.amount}`;
    return `${range}: ${amount}`;
  }

  private date(value: any): string {
    return value ? this.dateUtils.formatDate(value, this.settingsService.dateFormat) : '';
  }
}
