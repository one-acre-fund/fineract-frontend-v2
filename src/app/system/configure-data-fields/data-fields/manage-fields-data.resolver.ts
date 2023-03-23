import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SystemService } from 'app/system/system.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageFieldsDataResolver implements Resolve<Object> {
  /**
   * @param {SystemService} systemService System service.
   */
  constructor(private systemService: SystemService) {}

  /**
   * Returns the manage data field config data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.systemService.getFieldCodes();
  }
}
