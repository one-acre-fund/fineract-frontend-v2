import {
  DownPaymentBandFormValue,
  DownPaymentConfigurationFormValue,
  DownPaymentPeriodFormValue,
} from './down-payment-configuration.models';

/**
 * The rules a loan product's down payment configurations must satisfy, checked in the browser so the user sees a
 * problem while editing rather than as a rejected request. They mirror DownPaymentConfigurationValidator on the server,
 * including its codes, which stay the last segment of the server's own
 * (validation.msg.loanproduct.downpayment.<code>).
 */

export interface DownPaymentValidationError {
  /** Where the problem is, e.g. 'configurations[0].periods[1].bands[2].minPrincipal' */
  path: string;
  /** The server's error code without its validation.msg.loanproduct.downpayment. prefix */
  code: string;
  message: string;
}

export interface DownPaymentValidationOptions {
  /** The lowest principal the product allows; the bands must start at or below it. Null means zero. */
  minPrincipal?: number | null;
  /** The highest principal the product allows; the bands must reach it, or the top band must be open ended */
  maxPrincipal?: number | null;
  /** True in a country whose loans need the client to qualify by paying a down payment */
  requireAtLeastOne?: boolean;
}

const MAX_NAME_LENGTH = 100;
const MAX_PERCENTAGE = 100;

export function validateDownPaymentConfigurations(
  configurations: DownPaymentConfigurationFormValue[] | null | undefined,
  options: DownPaymentValidationOptions = {}
): DownPaymentValidationError[] {
  const items = configurations || [];
  const errors: DownPaymentValidationError[] = [];

  if (options.requireAtLeastOne && items.length === 0) {
    errors.push(
      error('configurations', 'configuration.required', 'The loan product needs at least one down payment configuration')
    );
  }

  validateNamesAndOffices(items, errors);
  items.forEach((configuration, index) => validateConfiguration(configuration, configurationPath(index), options, errors));

  return errors;
}

function validateNamesAndOffices(
  configurations: DownPaymentConfigurationFormValue[],
  errors: DownPaymentValidationError[]
): void {
  const indexByName = new Map<string, number>();
  const indexByOffice = new Map<number, number>();

  configurations.forEach((configuration, index) => {
    const path = configurationPath(index);
    const name = (configuration.name || '').trim();

    if (!name) {
      errors.push(error(`${path}.name`, 'name.required', 'The configuration name is required'));
    } else if (name.length > MAX_NAME_LENGTH) {
      errors.push(
        error(`${path}.name`, 'name.too.long', `The configuration name must be at most ${MAX_NAME_LENGTH} characters`)
      );
    } else {
      const previous = indexByName.get(name.toLowerCase());
      if (previous === undefined) {
        indexByName.set(name.toLowerCase(), index);
      } else {
        errors.push(
          error(`${path}.name`, 'name.duplicate', `The configuration name '${name}' is already used by ${configurationPath(previous)}`)
        );
      }
    }

    const officeIds = configuration.officeIds || [];
    if (officeIds.length === 0) {
      errors.push(error(`${path}.officeIds`, 'offices.required', 'A configuration needs at least one office'));
    }
    officeIds.forEach((officeId) => {
      const previous = indexByOffice.get(officeId);
      if (previous === undefined) {
        indexByOffice.set(officeId, index);
      } else {
        errors.push(
          error(
            `${path}.officeIds`,
            'office.duplicate',
            `Office ${officeId} is already in ${configurationPath(previous)}; an office can belong to only one configuration of a product`
          )
        );
      }
    });
  });
}

function validateConfiguration(
  configuration: DownPaymentConfigurationFormValue,
  path: string,
  options: DownPaymentValidationOptions,
  errors: DownPaymentValidationError[]
): void {
  const periods = configuration.periods || [];

  if (!configuration.type) {
    errors.push(error(`${path}.type`, 'type.required', 'The configuration type is required (STATIC or DYNAMIC)'));
  } else if (configuration.type === 'STATIC') {
    validateStaticPeriods(periods, path, errors);
  } else {
    validateDynamicPeriods(periods, path, errors);
  }

  periods.forEach((period, index) => validateBands(period, periodPath(path, index), options, errors));
}

function validateStaticPeriods(
  periods: DownPaymentPeriodFormValue[],
  path: string,
  errors: DownPaymentValidationError[]
): void {
  if (periods.length !== 1) {
    errors.push(
      error(`${path}.periods`, 'static.period.count', `A STATIC configuration has exactly one period, found ${periods.length}`)
    );
  }
  periods.forEach((period, index) => {
    if (period.fromDate || period.toDate) {
      errors.push(
        error(`${periodPath(path, index)}.fromDate`, 'static.period.dates.not.allowed', 'The period of a STATIC configuration has no dates')
      );
    }
  });
}

function validateDynamicPeriods(
  periods: DownPaymentPeriodFormValue[],
  path: string,
  errors: DownPaymentValidationError[]
): void {
  if (periods.length === 0) {
    errors.push(error(`${path}.periods`, 'dynamic.period.required', 'A DYNAMIC configuration needs at least one period'));
    return;
  }

  let allDated = true;
  periods.forEach((period, index) => {
    const itemPath = periodPath(path, index);
    if (!period.fromDate) {
      errors.push(
        error(`${itemPath}.fromDate`, 'dynamic.period.dates.required', 'The periods of a DYNAMIC configuration need a fromDate')
      );
      allDated = false;
    }
    if (!period.toDate) {
      errors.push(error(`${itemPath}.toDate`, 'dynamic.period.dates.required', 'The periods of a DYNAMIC configuration need a toDate'));
      allDated = false;
    }
    if (period.fromDate && period.toDate && startOfDay(period.fromDate) > startOfDay(period.toDate)) {
      errors.push(
        error(
          `${itemPath}.fromDate`,
          'period.fromdate.after.todate',
          `The period fromDate ${isoDate(period.fromDate)} is after its toDate ${isoDate(period.toDate)}`
        )
      );
    }
  });

  if (!allDated) {
    return;
  }

  // the periods of a configuration must form one unbroken stretch of time, in whatever order they were entered
  const byStart = sortedIndexes(periods, (period) => startOfDay(period.fromDate));
  for (let position = 1; position < byStart.length; position++) {
    const previous = periods[byStart[position - 1]];
    const index = byStart[position];
    const period = periods[index];
    const expectedStart = addDays(previous.toDate, 1);
    const start = startOfDay(period.fromDate);
    if (start > startOfDay(expectedStart)) {
      errors.push(
        error(
          `${periodPath(path, index)}.fromDate`,
          'period.gap.detected',
          `Gap between periods: the period ending ${isoDate(previous.toDate)} must be followed by one starting ` +
            `${isoDate(expectedStart)}, found ${isoDate(period.fromDate)}`
        )
      );
    } else if (start < startOfDay(expectedStart)) {
      errors.push(
        error(
          `${periodPath(path, index)}.fromDate`,
          'period.overlap.detected',
          `The period starting ${isoDate(period.fromDate)} overlaps the period ending ${isoDate(previous.toDate)}`
        )
      );
    }
  }
}

function validateBands(
  period: DownPaymentPeriodFormValue,
  periodPathValue: string,
  options: DownPaymentValidationOptions,
  errors: DownPaymentValidationError[]
): void {
  const bands = period.bands || [];
  if (bands.length === 0) {
    errors.push(error(`${periodPathValue}.bands`, 'bands.required', 'A period needs at least one principal band'));
    return;
  }

  let boundsUsable = true;
  bands.forEach((band, index) => {
    boundsUsable = validateBand(band, bandPath(periodPathValue, index), errors) && boundsUsable;
  });
  if (!boundsUsable) {
    return;
  }

  const byMin = sortedIndexes(bands, (band) => band.minPrincipal);
  byMin.forEach((index, position) => {
    const band = bands[index];
    const path = bandPath(periodPathValue, index);
    const last = position === byMin.length - 1;

    if (band.maxPrincipal == null && !last) {
      errors.push(
        error(`${path}.maxPrincipal`, 'band.open.ended.not.last', 'Only the band with the highest principals may have no maxPrincipal')
      );
    }
    if (position > 0) {
      const previous = bands[byMin[position - 1]];
      if (previous.maxPrincipal != null) {
        const expectedMin = previous.maxPrincipal + 1;
        if (band.minPrincipal > expectedMin) {
          errors.push(
            error(
              `${path}.minPrincipal`,
              'band.gap.detected',
              `Gap between bands: the band ending at ${previous.maxPrincipal} must be followed by one starting at ` +
                `${expectedMin}, found ${band.minPrincipal}`
            )
          );
        } else if (band.minPrincipal < expectedMin) {
          errors.push(
            error(
              `${path}.minPrincipal`,
              'band.overlap.detected',
              `The band starting at ${band.minPrincipal} overlaps the band ending at ${previous.maxPrincipal}`
            )
          );
        }
      }
    }
  });

  const lowest = bands[byMin[0]];
  const requiredStart = options.minPrincipal ?? 0;
  if (lowest.minPrincipal > requiredStart) {
    errors.push(
      error(
        `${bandPath(periodPathValue, byMin[0])}.minPrincipal`,
        'band.coverage.incomplete',
        `The bands must start at or below ${requiredStart}, the lowest principal the product allows`
      )
    );
  }

  const highestIndex = byMin[byMin.length - 1];
  const highest = bands[highestIndex];
  if (highest.maxPrincipal != null && (options.maxPrincipal == null || highest.maxPrincipal < options.maxPrincipal)) {
    errors.push(
      error(
        `${bandPath(periodPathValue, highestIndex)}.maxPrincipal`,
        'band.coverage.incomplete',
        options.maxPrincipal == null
          ? 'The product has no maximum principal, so the highest band must have no maxPrincipal'
          : `The bands must reach ${options.maxPrincipal}, the highest principal the product allows, or the highest band must have no maxPrincipal`
      )
    );
  }
}

/**
 * @returns whether the band's bounds are present and consistent, so it can take part in the ordering checks
 */
function validateBand(band: DownPaymentBandFormValue, path: string, errors: DownPaymentValidationError[]): boolean {
  let boundsUsable = true;

  if (band.minPrincipal == null) {
    errors.push(error(`${path}.minPrincipal`, 'band.min.required', 'The band minPrincipal is required'));
    boundsUsable = false;
  } else if (!isWholeNumber(band.minPrincipal) || band.minPrincipal < 0) {
    errors.push(
      error(`${path}.minPrincipal`, 'band.not.whole.number', 'The band minPrincipal must be a whole number of at least 0')
    );
    boundsUsable = false;
  }
  if (band.maxPrincipal != null && !isWholeNumber(band.maxPrincipal)) {
    errors.push(error(`${path}.maxPrincipal`, 'band.not.whole.number', 'The band maxPrincipal must be a whole number'));
    boundsUsable = false;
  }
  if (boundsUsable && band.maxPrincipal != null && band.minPrincipal > band.maxPrincipal) {
    errors.push(
      error(
        `${path}.minPrincipal`,
        'band.min.greater.than.max',
        `The band minPrincipal ${band.minPrincipal} is above its maxPrincipal ${band.maxPrincipal}`
      )
    );
    boundsUsable = false;
  }

  if (!band.calculationType) {
    errors.push(
      error(`${path}.calculationType`, 'band.calculation.type.required', 'The band calculationType is required (FLAT or PERCENTAGE)')
    );
  }
  if (band.amount == null || band.amount <= 0) {
    errors.push(error(`${path}.amount`, 'band.amount.invalid', 'The band amount must be greater than 0'));
  } else if (band.calculationType === 'PERCENTAGE' && band.amount > MAX_PERCENTAGE) {
    errors.push(error(`${path}.amount`, 'band.amount.invalid', 'A PERCENTAGE band amount must be at most 100'));
  }

  return boundsUsable;
}

function sortedIndexes<T>(items: T[], keyOf: (item: T) => number): number[] {
  return items.map((_, index) => index).sort((left, right) => keyOf(items[left]) - keyOf(items[right]));
}

function isWholeNumber(value: number): boolean {
  return Number.isInteger(value);
}

/** Compares and shifts dates by whole days, ignoring whatever time a datepicker left on them */
function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function isoDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function configurationPath(index: number): string {
  return `configurations[${index}]`;
}

function periodPath(configurationPathValue: string, index: number): string {
  return `${configurationPathValue}.periods[${index}]`;
}

function bandPath(periodPathValue: string, index: number): string {
  return `${periodPathValue}.bands[${index}]`;
}

function error(path: string, code: string, message: string): DownPaymentValidationError {
  return { path, code, message };
}
