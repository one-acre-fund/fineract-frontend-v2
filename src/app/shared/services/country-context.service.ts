import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { APP_CONSTANTS } from 'app/shared/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class CountryContextService {
  getCountryId(route?: ActivatedRouteSnapshot): string | undefined {
    const fromQuery = route?.queryParamMap.get('countryId');
    const fromParam = route?.paramMap.get('countryId');
    let countryId = [fromQuery, fromParam].find(
      v => v != null && v !== 'null' && v !== 'undefined'
    ) as string | undefined;

    if (!countryId) {
      const raw = sessionStorage.getItem(APP_CONSTANTS.SESSION_STORAGE.SELECTED_COUNTRY);
      try {
        const parsed = raw ? JSON.parse(raw) : undefined;
        if (parsed?.id != null) {
          countryId = String(parsed.id);
        }
      } catch {
        // ignore malformed value
      }
    }
    return countryId;
  }
}