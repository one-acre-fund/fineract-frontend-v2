/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { ProductsService } from '../products.service';

/**
 * Tax Component template data resolver.
 */
@Injectable()
export class TaxComponentTemplateResolver  {

  /**
   * @param {ProductsService} productsService Products service.
   */
  constructor(private productsService: ProductsService) {}

  /**
   * Returns the tax components template data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.productsService.getTaxComponentTemplate();
  }

}
