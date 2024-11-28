/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { AuditService } from '../audit.service';

/**
 * Audit Trail data resolver.
 */
@Injectable()
export class AuditTrailResolver implements Resolve<Object> {

  /**
   * @param {AuditService} auditService Organization service.
   */
  constructor(private auditService: AuditService) {}

  /**
   * Returns the Audit Trail data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const auditTrailId = route.paramMap.get('id');
    return this.auditService.getAuditTrail(auditTrailId);
  }

}
