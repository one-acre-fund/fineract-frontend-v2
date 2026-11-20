/**
 * Down payment configurations of a loan product.
 *
 * A product owns one or more configurations, each scoped to a set of offices and holding periods of principal bands.
 * The configuration that applies to a loan is the one whose office is closest to the client's office in the office
 * hierarchy; within it, the period covering the business date and the band covering the approved principal decide the
 * down payment. A product only takes a down payment when its strategy is CONFIGURED.
 */

export type DownPaymentConfigurationType = 'STATIC' | 'DYNAMIC';

export type AmountCalculationType = 'FLAT' | 'PERCENTAGE';

export const DOWN_PAYMENT_STRATEGY_NONE = 'NONE';
export const DOWN_PAYMENT_STRATEGY_CONFIGURED = 'CONFIGURED';

/** As returned by the loan product API: dates are ISO strings (yyyy-MM-dd) and amounts carry no trailing zeros */
export interface DownPaymentConfigurationResponse {
  id: number;
  loanProductId: number;
  name: string;
  type: DownPaymentConfigurationType;
  offices: DownPaymentConfigurationOfficeResponse[];
  periods: DownPaymentPeriodResponse[];
}

export interface DownPaymentConfigurationOfficeResponse {
  officeId: number;
  officeName: string;
  /** The office hierarchy (e.g. '.2.14.'), so a client can show which offices a configuration reaches */
  hierarchy: string;
}

export interface DownPaymentPeriodResponse {
  id: number;
  /** Both dates are null for the single period of a STATIC configuration */
  fromDate: string | null;
  toDate: string | null;
  bands: DownPaymentBandResponse[];
}

export interface DownPaymentBandResponse {
  id: number;
  minPrincipal: number;
  /** null when the band has no upper limit */
  maxPrincipal: number | null;
  calculationType: AmountCalculationType;
  amount: number;
}

/** What the form holds while editing: dates are Date objects for the datepicker and a null id means 'not saved yet' */
export interface DownPaymentConfigurationFormValue {
  id: number | null;
  name: string | null;
  type: DownPaymentConfigurationType | null;
  officeIds: number[];
  periods: DownPaymentPeriodFormValue[];
}

export interface DownPaymentPeriodFormValue {
  id: number | null;
  fromDate: Date | null;
  toDate: Date | null;
  bands: DownPaymentBandFormValue[];
}

export interface DownPaymentBandFormValue {
  id: number | null;
  minPrincipal: number | null;
  maxPrincipal: number | null;
  calculationType: AmountCalculationType | null;
  amount: number | null;
}

/**
 * The ids of saved items the user removed. They are left out of the form but must still reach the API, which keeps a
 * saved configuration, period or band unless it is sent back marked for deletion.
 *
 * The API merges each level against the saved items of its own parent, so a removed period has to travel inside the
 * configuration that owns it and a removed band inside its period, or the id is rejected as unknown. Removing a
 * configuration takes its periods and bands with it, so those need no ids of their own.
 */
export interface RemovedDownPaymentItems {
  configurationIds: number[];
  periodIdsByConfigurationId: { [configurationId: number]: number[] };
  bandIdsByPeriodId: { [periodId: number]: number[] };
}

/**
 * As sent to the loan product API. An item with an id changes that item and a null field keeps its saved value;
 * officeIds replaces the office set when present. Dates use the request's own dateFormat and locale.
 */
export interface DownPaymentConfigurationRequest {
  id?: number;
  name?: string;
  type?: DownPaymentConfigurationType;
  officeIds?: number[];
  periods?: DownPaymentPeriodRequest[];
  markedForDeletion?: boolean;
}

export interface DownPaymentPeriodRequest {
  id?: number;
  fromDate?: string;
  toDate?: string;
  bands?: DownPaymentBandRequest[];
  markedForDeletion?: boolean;
}

export interface DownPaymentBandRequest {
  id?: number;
  minPrincipal?: number;
  /** Always sent, because a null maxPrincipal means 'no upper limit' rather than 'keep the saved one' */
  maxPrincipal?: number | null;
  calculationType?: AmountCalculationType;
  amount?: number;
  markedForDeletion?: boolean;
}

/** Converts between the API's ISO dates and the Date objects the form holds, in the user's configured date format */
export interface DownPaymentDateAdapter {
  parse(isoDate: string): Date;
  format(date: Date): string;
}

export function emptyRemovedDownPaymentItems(): RemovedDownPaymentItems {
  return { configurationIds: [], periodIdsByConfigurationId: {}, bandIdsByPeriodId: {} };
}
