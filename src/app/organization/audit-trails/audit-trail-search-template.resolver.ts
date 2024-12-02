/** Angular Imports */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { AuditService } from './audit.service';

/**
 * Audit Trail Search Template data resolver.
 */
@Injectable()
export class AuditTrailSearchTemplateResolver implements Resolve<Object> {

  /**
   * @param {AuditService} auditService Audit service.
   */
  constructor(private auditService: AuditService) {}

  /**
   * Returns the Audit Trail Search Template data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.auditService.getAuditTrailSearchTemplate();
  }

}
