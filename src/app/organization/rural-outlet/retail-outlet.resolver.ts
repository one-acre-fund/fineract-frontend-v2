import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { OrganizationService } from '../organization.service';

@Injectable({
  providedIn: 'root'
})
export class RetailOutletResolver implements Resolve<object> {
 /*** @param {OrganizationService} organizationService Organization service.*/
  constructor(private organizationService: OrganizationService) {}

  /**
   * Returns the manage funds data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.organizationService.getRuralRetailOutlets();
  }
}
