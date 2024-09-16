/** Angular Imports */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ProductsService } from '../products.service';

/**
 * Loan Product data resolver.
 */
@Injectable()
export class LoanProductAllocationResolver  {

  /**
   * @param {ProductsService} productsService Products service.
   */
  constructor(private productsService: ProductsService) { }

  /**
   * Returns the loan product data.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.productsService.getLoanProductAllocationSetting();
  }

}
