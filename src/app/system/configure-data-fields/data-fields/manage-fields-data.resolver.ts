import { Injectable } from '@angular/core';

import { SystemService } from 'app/system/system.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageFieldsDataResolver  {
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
