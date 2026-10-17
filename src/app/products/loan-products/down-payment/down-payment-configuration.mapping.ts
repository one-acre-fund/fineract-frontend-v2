import {
  DownPaymentBandFormValue,
  DownPaymentBandRequest,
  DownPaymentBandResponse,
  DownPaymentConfigurationFormValue,
  DownPaymentConfigurationRequest,
  DownPaymentConfigurationResponse,
  DownPaymentDateAdapter,
  DownPaymentPeriodFormValue,
  DownPaymentPeriodRequest,
  DownPaymentPeriodResponse,
  RemovedDownPaymentItems,
} from './down-payment-configuration.models';

/**
 * Turns the configurations of a loan product into the value the form edits. Called once, when the edit page loads the
 * product.
 */
export function toDownPaymentFormValue(
  configurations: DownPaymentConfigurationResponse[] | null | undefined,
  dates: DownPaymentDateAdapter
): DownPaymentConfigurationFormValue[] {
  return (configurations || []).map((configuration) => ({
    id: configuration.id ?? null,
    name: configuration.name ?? null,
    type: configuration.type ?? null,
    officeIds: (configuration.offices || []).map((office) => office.officeId),
    periods: (configuration.periods || []).map((period) => toPeriodFormValue(period, dates)),
  }));
}

function toPeriodFormValue(period: DownPaymentPeriodResponse, dates: DownPaymentDateAdapter): DownPaymentPeriodFormValue {
  return {
    id: period.id ?? null,
    fromDate: period.fromDate ? dates.parse(period.fromDate) : null,
    toDate: period.toDate ? dates.parse(period.toDate) : null,
    bands: (period.bands || []).map((band) => toBandFormValue(band)),
  };
}

function toBandFormValue(band: DownPaymentBandResponse): DownPaymentBandFormValue {
  return {
    id: band.id ?? null,
    minPrincipal: band.minPrincipal ?? null,
    maxPrincipal: band.maxPrincipal ?? null,
    calculationType: band.calculationType ?? null,
    amount: band.amount ?? null,
  };
}

/**
 * Turns the form value into the configurations the loan product API takes, appending the saved items the user removed
 * so the API deletes them. Dates are formatted with the request's date format, which the caller also puts on the
 * request itself.
 *
 * @param configurations the form value, holding only the items the product should keep
 * @param removed the ids of saved items the user removed
 */
export function toDownPaymentRequest(
  configurations: DownPaymentConfigurationFormValue[] | null | undefined,
  removed: RemovedDownPaymentItems,
  dates: DownPaymentDateAdapter
): DownPaymentConfigurationRequest[] {
  const kept = (configurations || []).map((configuration) => toConfigurationRequest(configuration, removed, dates));
  const deleted = (removed?.configurationIds || []).map((id) => ({ id, markedForDeletion: true }));
  return [...kept, ...deleted];
}

function toConfigurationRequest(
  configuration: DownPaymentConfigurationFormValue,
  removed: RemovedDownPaymentItems,
  dates: DownPaymentDateAdapter
): DownPaymentConfigurationRequest {
  const request: DownPaymentConfigurationRequest = {
    name: configuration.name ?? undefined,
    type: configuration.type ?? undefined,
    officeIds: [...(configuration.officeIds || [])],
    periods: (configuration.periods || []).map((period) => toPeriodRequest(period, removed, dates)),
  };
  if (configuration.id != null) {
    request.id = configuration.id;
    // a period is merged against its own configuration's saved periods, so its id only belongs here
    request.periods = [...request.periods, ...markedForDeletion(removed?.periodIdsByConfigurationId?.[configuration.id])];
  }
  return request;
}

function toPeriodRequest(
  period: DownPaymentPeriodFormValue,
  removed: RemovedDownPaymentItems,
  dates: DownPaymentDateAdapter
): DownPaymentPeriodRequest {
  const request: DownPaymentPeriodRequest = {
    fromDate: period.fromDate ? dates.format(period.fromDate) : undefined,
    toDate: period.toDate ? dates.format(period.toDate) : undefined,
    bands: (period.bands || []).map((band) => toBandRequest(band)),
  };
  if (period.id != null) {
    request.id = period.id;
    request.bands = [...request.bands, ...markedForDeletion(removed?.bandIdsByPeriodId?.[period.id])];
  }
  return request;
}

function toBandRequest(band: DownPaymentBandFormValue): DownPaymentBandRequest {
  const request: DownPaymentBandRequest = {
    minPrincipal: band.minPrincipal ?? undefined,
    // always sent: a null maxPrincipal means 'no upper limit', not 'keep the saved one'
    maxPrincipal: band.maxPrincipal ?? null,
    calculationType: band.calculationType ?? undefined,
    amount: band.amount ?? undefined,
  };
  if (band.id != null) {
    request.id = band.id;
  }
  return request;
}

function markedForDeletion(ids: number[] | undefined): { id: number; markedForDeletion: boolean }[] {
  return (ids || []).map((id) => ({ id, markedForDeletion: true }));
}
