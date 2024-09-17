/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { OrganizationService } from '../organization.service';

/**
 * Payment Types data resolver.
 */
@Injectable()
export class PaymentTypesResolver  {

  /**
   * @param {OrganizationService} organizationService Organization service.
   */
  constructor(private organizationService: OrganizationService) {}

  /**
   * Returns the payment types data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.organizationService.getPaymentTypes();
  }

}
