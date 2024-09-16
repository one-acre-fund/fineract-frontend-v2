/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { AccountingService } from '../accounting.service';

/**
 * Accounting rules template data resolver.
 */
@Injectable()
export class AccountingRulesTemplateResolver  {

  /**
   * @param {AccountingService} accountingService Accounting service.
   */
  constructor(private accountingService: AccountingService) {}

  /**
   * Returns the accounting rules template data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.accountingService.getAccountingRulesTemplate();
  }

}
