/** Angular Imports */
import { Injectable } from '@angular/core';

/** Custom Models */
import { FeatureFlag, FeatureFlagMap } from './feature-flags.model';

/**
 * Feature Flags Service.
 *
 * Phase 1 POC source: runtime config from assets/env.js.
 *
 * Supported FEATURE_FLAGS formats:
 * - Comma-separated key/value pairs: clients.kyc-v2=false,notifications.v2=true
 * - JSON object: {"clients.kyc-v2":{"enabled":false,"owner":"clients"}}
 */
@Injectable()
export class FeatureFlagsService {

  /** Runtime flags loaded once at app startup. */
  private readonly flags: FeatureFlagMap;

  constructor() {
    this.flags = this.parseFeatureFlags(this.readRuntimeFeatureFlags());
  }

  /**
   * Checks whether a feature is enabled.
   * Unknown flags fail closed and are treated as disabled.
   * @param flagName Stable feature flag name.
   */
  isEnabled(flagName: string): boolean {
    const flag = this.getFlag(flagName);
    return !!flag && flag.enabled === true;
  }

  /**
   * Checks whether a feature is disabled.
   * @param flagName Stable feature flag name.
   */
  isDisabled(flagName: string): boolean {
    return !this.isEnabled(flagName);
  }

  /**
   * Gets a feature flag definition if present.
   * @param flagName Stable feature flag name.
   */
  getFlag(flagName: string): FeatureFlag | null {
    const normalizedFlagName = this.normalizeFlagName(flagName);
    return normalizedFlagName && this.flags[normalizedFlagName] ? this.flags[normalizedFlagName] : null;
  }

  /**
   * Returns all loaded flags. Useful for demos/debugging, not for secrets.
   */
  getAllFlags(): FeatureFlagMap {
    return Object.assign({}, this.flags);
  }

  /**
   * Parses runtime flag config. Public to keep the parser easy to unit-test.
   * @param raw Runtime config value from window['env']['featureFlags'].
   */
  parseFeatureFlags(raw: any): FeatureFlagMap {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      return this.parseObjectFlags(raw);
    }

    const rawValue = typeof raw === 'string' ? raw.trim() : '';
    if (this.isEmptyOrUnresolved(rawValue)) {
      return {};
    }

    if (rawValue.charAt(0) === '{') {
      try {
        return this.parseObjectFlags(JSON.parse(rawValue));
      } catch (error) {
        // Fail closed: invalid config means all runtime flags are disabled.
        console.warn('[FeatureFlags] Invalid FEATURE_FLAGS JSON. Runtime feature flags were disabled.', error);
        return {};
      }
    }

    return this.parseKeyValueFlags(rawValue);
  }

  /** Reads the public runtime config generated into assets/env.js. */
  private readRuntimeFeatureFlags(): any {
    const runtimeWindow = window as any;
    console.log("window read runtime feature flags===", runtimeWindow.env);
    return runtimeWindow && runtimeWindow.env ? runtimeWindow.env.featureFlags : '';
  }

  /** Parses JSON/object style flags. */
  private parseObjectFlags(rawFlags: { [key: string]: any }): FeatureFlagMap {
    const parsedFlags: FeatureFlagMap = {};

    Object.keys(rawFlags || {}).forEach((flagName: string) => {
      const normalizedFlagName = this.normalizeFlagName(flagName);
      if (!normalizedFlagName) {
        return;
      }

      const rawFlag = rawFlags[flagName];
      if (rawFlag && typeof rawFlag === 'object' && !Array.isArray(rawFlag)) {
        parsedFlags[normalizedFlagName] = Object.assign({}, rawFlag, {
          enabled: this.parseBoolean(rawFlag.enabled)
        });
      } else {
        parsedFlags[normalizedFlagName] = {
          enabled: this.parseBoolean(rawFlag)
        };
      }
    });

    return parsedFlags;
  }

  /** Parses comma-separated flags such as clients.kyc-v2=false,foo=true. */
  private parseKeyValueFlags(rawValue: string): FeatureFlagMap {
    const parsedFlags: FeatureFlagMap = {};

    rawValue.split(',').forEach((entry: string) => {
      const trimmedEntry = entry.trim();
      if (!trimmedEntry) {
        return;
      }

      const assignmentIndex = trimmedEntry.indexOf('=');
      const flagName = assignmentIndex >= 0 ? trimmedEntry.substring(0, assignmentIndex).trim() : trimmedEntry;
      // A bare flag name, e.g. "clients.kyc-v2", is treated as enabled for quick local demos.
      const rawFlagValue = assignmentIndex >= 0 ? trimmedEntry.substring(assignmentIndex + 1).trim() : 'true';
      const normalizedFlagName = this.normalizeFlagName(flagName);

      if (normalizedFlagName) {
        parsedFlags[normalizedFlagName] = {
          enabled: this.parseBoolean(rawFlagValue)
        };
      }
    });

    return parsedFlags;
  }

  /** Converts common runtime boolean strings into real booleans. */
  private parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    if (typeof value === 'string') {
      switch (value.trim().toLowerCase()) {
        case 'true':
        case '1':
        case 'yes':
        case 'y':
        case 'on':
        case 'enabled':
          return true;
        case 'false':
        case '0':
        case 'no':
        case 'n':
        case 'off':
        case 'disabled':
        case '':
          return false;
        default:
          return false;
      }
    }

    return false;
  }

  private normalizeFlagName(flagName: string): string {
    return typeof flagName === 'string' ? flagName.trim() : '';
  }

  private isEmptyOrUnresolved(rawValue: string): boolean {
    return !rawValue || rawValue === 'undefined' || rawValue === 'null' || rawValue.charAt(0) === '$';
  }

}

