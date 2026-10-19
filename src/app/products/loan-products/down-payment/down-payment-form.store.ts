import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';

import { OfficeTreeNode } from 'app/shared/office-tree-view/office-tree-node';

import { toDownPaymentFormValue, toDownPaymentRequest } from './down-payment-configuration.mapping';
import {
  DownPaymentConfigurationFormValue,
  DownPaymentConfigurationRequest,
  DownPaymentConfigurationResponse,
  DownPaymentConfigurationType,
  DownPaymentDateAdapter,
  RemovedDownPaymentItems,
  emptyRemovedDownPaymentItems,
} from './down-payment-configuration.models';
import { DownPaymentValidationError, validateDownPaymentConfigurations } from './down-payment-configuration.validators';

/**
 * Holds the down payment configurations being edited: the form, the saved items the user removed, and the rules that
 * span rows. The down payment step provides one instance, which its configuration, period and band components inject,
 * so the three levels change the same form without passing events up through it.
 */
@Injectable()
export class DownPaymentFormStore {
  /** The form the step registers as its stepControl: { configurations: [...] } */
  form: UntypedFormGroup;

  /** Saved items the user removed, which still have to reach the API for it to delete them */
  removed: RemovedDownPaymentItems = emptyRemovedDownPaymentItems();

  /** The problems that span rows, i.e. everything the field validators cannot see on their own */
  errors: DownPaymentValidationError[] = [];

  /** The offices of the product's country, as the tree component takes them */
  officeTree: OfficeTreeNode[] = [];

  /** The offices the product was loaded with, which stay even if the office tree does not reach them */
  private loadedOfficeIds: number[] = [];
  /** The offices the picker shows, i.e. the active ones of the product's country */
  private officeTreeIds: number[] = [];
  private minPrincipal: number | null = null;
  private maxPrincipal: number | null = null;
  /** The office tree and the taken offices as each configuration sees them, rebuilt only when something changes */
  private officeViews: { tree: OfficeTreeNode[]; disabledOfficeIds: number[] }[] = [];

  constructor(private formBuilder: UntypedFormBuilder) {
    this.form = this.formBuilder.group({ configurations: this.formBuilder.array([]) });
    this.form.setValidators((control: AbstractControl) => this.validate(control));
  }

  get configurations(): UntypedFormArray {
    return this.form.get('configurations') as UntypedFormArray;
  }

  /** Loads the product's saved configurations, or seeds one for a product that has none yet */
  load(configurations: DownPaymentConfigurationResponse[] | null | undefined, dates: DownPaymentDateAdapter): void {
    const values = toDownPaymentFormValue(configurations, dates);
    this.loadedOfficeIds = values.reduce((officeIds: number[], value) => officeIds.concat(value.officeIds || []), []);
    this.configurations.clear();
    values.forEach((value) => this.configurations.push(this.configurationGroup(value)));
    if (this.configurations.length === 0) {
      this.addConfiguration();
    }
    this.form.markAsPristine();
    this.refreshOfficeViews();
    this.revalidate();
  }

  /** The lowest and highest principal the product allows, which the bands of every period have to cover */
  setPrincipalRange(minPrincipal: number | null, maxPrincipal: number | null): void {
    this.minPrincipal = toNumberOrNull(minPrincipal);
    this.maxPrincipal = toNumberOrNull(maxPrincipal);
    this.revalidate();
  }

  setOfficeTree(officeTree: OfficeTreeNode[]): void {
    this.officeTree = officeTree || [];
    this.officeTreeIds = officeIdsOf(this.officeTree, []);
    // a configuration cannot keep an office of the country the product no longer belongs to, but an office it was
    // saved with stays whether or not the tree reaches it
    if (this.officeTree.length > 0) {
      this.configurations.controls.forEach((configuration) => {
        const officeIds: number[] = configuration.get('officeIds').value || [];
        const kept = officeIds.filter(
          (officeId) => this.officeTreeIds.indexOf(officeId) > -1 || this.loadedOfficeIds.indexOf(officeId) > -1
        );
        if (kept.length !== officeIds.length) {
          configuration.get('officeIds').setValue(kept);
        }
      });
    }
    this.refreshOfficeViews();
  }

  addConfiguration(): void {
    this.configurations.push(
      this.configurationGroup({
        id: null,
        name: null,
        type: 'STATIC',
        officeIds: [],
        periods: [{ id: null, fromDate: null, toDate: null, bands: [newBand()] }],
      })
    );
    this.touch();
  }

  removeConfiguration(index: number): void {
    const id = this.configurations.at(index).get('id').value;
    if (id != null) {
      // its periods and bands go with it, so they need no ids of their own
      this.removed.configurationIds.push(id);
      delete this.removed.periodIdsByConfigurationId[id];
    }
    this.configurations.removeAt(index);
    this.touch();
  }

  periodsOf(configurationIndex: number): UntypedFormArray {
    return this.configurations.at(configurationIndex).get('periods') as UntypedFormArray;
  }

  bandsOf(configurationIndex: number, periodIndex: number): UntypedFormArray {
    return this.periodsOf(configurationIndex).at(periodIndex).get('bands') as UntypedFormArray;
  }

  /**
   * Adds a period that splits the principal the same way the period before it does: the bands keep their principal
   * ranges, and the user fills in the dates the period covers and what each band charges in it.
   */
  addPeriod(configurationIndex: number): void {
    const periods = this.periodsOf(configurationIndex);
    const previousBands: any[] = periods.length > 0 ? (periods.at(periods.length - 1).get('bands') as UntypedFormArray).value : [];
    const bands = previousBands.length > 0
      ? previousBands.map((band: any) => ({
        id: null,
        minPrincipal: band.minPrincipal,
        maxPrincipal: band.maxPrincipal,
        calculationType: null,
        amount: null,
      }))
      : [newBand()];
    periods.push(this.periodGroup({ id: null, fromDate: null, toDate: null, bands }));
    this.touch();
  }

  /**
   * Whether another period of the same configuration already covers a date. The periods of a configuration may not
   * overlap, so those dates are not offered.
   */
  isDateTaken(configurationIndex: number, periodIndex: number, date: Date): boolean {
    if (!date) {
      return false;
    }
    const day = startOfDay(date);
    return this.periodsOf(configurationIndex).controls.some((period, index) => {
      if (index === periodIndex) {
        return false;
      }
      const fromDate = period.get('fromDate').value;
      const toDate = period.get('toDate').value;
      return !!fromDate && !!toDate && day >= startOfDay(fromDate) && day <= startOfDay(toDate);
    });
  }

  removePeriod(configurationIndex: number, periodIndex: number): void {
    const configurationId = this.configurations.at(configurationIndex).get('id').value;
    const periodId = this.periodsOf(configurationIndex).at(periodIndex).get('id').value;
    if (configurationId != null && periodId != null) {
      this.rememberRemovedPeriod(configurationId, periodId);
    }
    this.periodsOf(configurationIndex).removeAt(periodIndex);
    this.touch();
  }

  addBand(configurationIndex: number, periodIndex: number): void {
    this.bandsOf(configurationIndex, periodIndex).push(this.bandGroup(newBand()));
    this.touch();
  }

  removeBand(configurationIndex: number, periodIndex: number, bandIndex: number): void {
    const periodId = this.periodsOf(configurationIndex).at(periodIndex).get('id').value;
    const bandId = this.bandsOf(configurationIndex, periodIndex).at(bandIndex).get('id').value;
    if (periodId != null && bandId != null) {
      this.rememberRemovedBand(periodId, bandId);
    }
    this.bandsOf(configurationIndex, periodIndex).removeAt(bandIndex);
    this.touch();
  }

  /**
   * A STATIC configuration has one period without dates, and a saved period cannot be made undated: the API keeps a
   * saved date when the request sends none. So becoming STATIC replaces the periods with a single undated one, keeping
   * the bands of the first as new bands, while becoming DYNAMIC only asks the user for the dates the periods now need.
   */
  changeType(configurationIndex: number, type: DownPaymentConfigurationType): void {
    const periods = this.periodsOf(configurationIndex);
    const dated = periods.controls.some((period) => period.get('fromDate').value || period.get('toDate').value);
    if (type !== 'STATIC' || (periods.length === 1 && !dated)) {
      this.touch();
      return;
    }

    const configurationId = this.configurations.at(configurationIndex).get('id').value;
    const bands: any[] = periods.length > 0 ? (periods.at(0).get('bands') as UntypedFormArray).value : [newBand()];
    periods.controls.forEach((period) => {
      const periodId = period.get('id').value;
      if (configurationId != null && periodId != null) {
        this.rememberRemovedPeriod(configurationId, periodId);
      }
    });
    periods.clear();
    periods.push(
      this.periodGroup({
        id: null,
        fromDate: null,
        toDate: null,
        // the bands belong to a new period, so they are new rows too
        bands: bands.map((band) => ({ ...band, id: null })),
      })
    );
    this.touch();
  }

  /** The office tree as this configuration sees it: its own offices ticked, the ones others own greyed out */
  officeTreeFor(configurationIndex: number): OfficeTreeNode[] {
    return this.officeViews[configurationIndex]?.tree || [];
  }

  /** The offices another configuration of this product already owns, which this one may not take */
  disabledOfficeIds(configurationIndex: number): number[] {
    return this.officeViews[configurationIndex]?.disabledOfficeIds || [];
  }

  /**
   * Takes the offices the picker reports, less any another configuration already owns: ticking a parent office offers
   * its whole subtree, and a child one of them has taken is not this configuration's to claim.
   */
  setOfficeIds(configurationIndex: number, officeIds: number[]): void {
    const control = this.configurations.at(configurationIndex).get('officeIds');
    const takenByOthers = this.disabledOfficeIds(configurationIndex);
    const picked = (officeIds || []).filter((officeId) => takenByOthers.indexOf(officeId) < 0);
    // an office the picker never showed, such as one the product was saved with that is no longer active, is not a
    // selection anybody can make or unmake here, so it outlives whatever the picker reports
    const beyondThePicker = (control.value || []).filter((officeId: number) => this.officeTreeIds.indexOf(officeId) < 0);
    const kept = picked.concat(beyondThePicker.filter((officeId: number) => picked.indexOf(officeId) < 0));
    // the picker reports its selection whenever it is built, a saved product's own offices included: an unchanged
    // set is not an edit, and treating it as one would offer to save a product nobody has touched
    if (sameOfficeIds(control.value || [], kept)) {
      return;
    }
    control.setValue(kept);
    this.touch();
  }

  /**
   * Keeps one tree per configuration, so the pickers are handed the same arrays until something actually changes:
   * rebuilding them while Angular checks the view would reset the tree component on every pass.
   */
  private refreshOfficeViews(): void {
    this.officeViews = this.configurations.controls.map((configuration, index) => {
      const selected: number[] = configuration.get('officeIds').value || [];
      const takenByOthers = this.configurations.controls
        .filter((_, otherIndex) => otherIndex !== index)
        .reduce((officeIds: number[], other) => officeIds.concat(other.get('officeIds').value || []), []);
      return { tree: markTree(this.officeTree, selected), disabledOfficeIds: takenByOthers };
    });
  }

  /** Every problem at or below a path, e.g. all of one configuration's including its periods and bands */
  messagesFor(path: string): string[] {
    return distinct(this.errors.filter((item) => isAtOrBelow(item.path, path)).map((item) => item.message));
  }

  /**
   * The problems of a configuration or period itself, leaving out those of the rows it holds, so each panel shows its
   * own. A nested path keeps an index after the one being asked about, e.g. configurations[0].periods[1].fromDate.
   */
  ownMessagesFor(path: string): string[] {
    return distinct(
      this.errors
        .filter((item) => isAtOrBelow(item.path, path) && item.path.substring(path.length).indexOf('[') < 0)
        .map((item) => item.message)
    );
  }

  /**
   * The configurations as the read only view shows them, with the offices named from the tree rather than left as the
   * ids the request carries, so a preview reads like the saved product does.
   */
  toDisplay(): any[] {
    const officeNames = officeNamesById(this.officeTree, {});
    return (this.configurations.value || []).map((configuration: DownPaymentConfigurationFormValue) => ({
      name: configuration.name,
      type: configuration.type,
      offices: (configuration.officeIds || []).map((officeId) => ({ officeId, officeName: officeNames[officeId] })),
      periods: (configuration.periods || []).map((period) => ({
        fromDate: period.fromDate,
        toDate: period.toDate,
        bands: period.bands || [],
      })),
    }));
  }

  /** What the loan product request carries, including the saved items the user removed */
  toRequest(dates: DownPaymentDateAdapter): DownPaymentConfigurationRequest[] {
    return toDownPaymentRequest(this.configurations.value, this.removed, dates);
  }

  private configurationGroup(value: DownPaymentConfigurationFormValue): UntypedFormGroup {
    return this.formBuilder.group({
      id: [value.id],
      name: [value.name, [Validators.required, Validators.maxLength(100)]],
      type: [value.type, Validators.required],
      officeIds: [[...(value.officeIds || [])], nonEmptyArray],
      periods: this.formBuilder.array((value.periods || []).map((period) => this.periodGroup(period))),
    });
  }

  private periodGroup(value: any): UntypedFormGroup {
    return this.formBuilder.group({
      id: [value.id],
      fromDate: [value.fromDate],
      toDate: [value.toDate],
      bands: this.formBuilder.array((value.bands || []).map((band: any) => this.bandGroup(band))),
    });
  }

  private bandGroup(value: any): UntypedFormGroup {
    return this.formBuilder.group({
      id: [value.id],
      minPrincipal: [value.minPrincipal, [Validators.required, Validators.min(0)]],
      maxPrincipal: [value.maxPrincipal],
      calculationType: [value.calculationType, Validators.required],
      amount: [value.amount, [Validators.required, Validators.min(0.01)]],
    });
  }

  private rememberRemovedPeriod(configurationId: number, periodId: number): void {
    const periodIds = this.removed.periodIdsByConfigurationId[configurationId] || [];
    this.removed.periodIdsByConfigurationId[configurationId] = [...periodIds, periodId];
    delete this.removed.bandIdsByPeriodId[periodId];
  }

  private rememberRemovedBand(periodId: number, bandId: number): void {
    const bandIds = this.removed.bandIdsByPeriodId[periodId] || [];
    this.removed.bandIdsByPeriodId[periodId] = [...bandIds, bandId];
  }

  private touch(): void {
    this.form.markAsDirty();
    this.refreshOfficeViews();
    this.revalidate();
  }

  private revalidate(): void {
    this.form.updateValueAndValidity();
  }

  /**
   * Runs the rules that span rows and keeps their messages for the panels to show. The step is only reachable with the
   * CONFIGURED strategy, which always needs at least one configuration.
   */
  private validate(control: AbstractControl): ValidationErrors | null {
    const configurations = (control.get('configurations')?.value || []) as DownPaymentConfigurationFormValue[];
    this.errors = validateDownPaymentConfigurations(configurations, {
      minPrincipal: this.minPrincipal,
      maxPrincipal: this.maxPrincipal,
      requireAtLeastOne: true,
    });
    return this.errors.length > 0 ? { downPaymentConfigurations: this.errors } : null;
  }
}

function newBand(): any {
  return { id: null, minPrincipal: null, maxPrincipal: null, calculationType: null, amount: null };
}

function nonEmptyArray(control: AbstractControl): ValidationErrors | null {
  return (control.value || []).length > 0 ? null : { required: true };
}

function toNumberOrNull(value: any): number | null {
  return value === null || value === undefined || value === '' ? null : Number(value);
}

function sameOfficeIds(left: number[], right: number[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  const sortedLeft = [...left].sort((a, b) => a - b);
  const sortedRight = [...right].sort((a, b) => a - b);
  return sortedLeft.every((officeId, index) => officeId === sortedRight[index]);
}

function isAtOrBelow(errorPath: string, path: string): boolean {
  return errorPath === path || errorPath.startsWith(`${path}.`);
}

function distinct(messages: string[]): string[] {
  return messages.filter((message, index, all) => all.indexOf(message) === index);
}

/** Compares dates by whole days, ignoring whatever time a datepicker left on them */
function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function officeIdsOf(nodes: OfficeTreeNode[], ids: number[]): number[] {
  (nodes || []).forEach((node) => {
    ids.push(node.id);
    officeIdsOf(node.children, ids);
  });
  return ids;
}

function officeNamesById(nodes: OfficeTreeNode[], names: { [officeId: number]: string }): { [officeId: number]: string } {
  (nodes || []).forEach((node) => {
    names[node.id] = node.name;
    officeNamesById(node.children, names);
  });
  return names;
}

/** Copies the tree with this configuration's offices ticked, leaving the source tree untouched */
function markTree(nodes: OfficeTreeNode[], selected: number[]): OfficeTreeNode[] {
  return (nodes || []).map((node) => ({
    ...node,
    checked: selected.indexOf(node.id) > -1,
    children: node.children ? markTree(node.children, selected) : node.children,
  }));
}
