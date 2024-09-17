/** Angular Imports */
import { Injectable } from "@angular/core";


/** rxjs Imports */
import { Observable } from "rxjs";

/** Custom Services */
import { ProductsService } from "../products.service";

/**
 * Loan products data resolver.
 */
@Injectable()
export class LoanProductsResolver  {
  /**
   *
   * @param {ProductsService} productsService Products service.
   */
  constructor(private productsService: ProductsService) {}

  /**
   * Returns the loan products data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    let countryId = JSON.parse(sessionStorage.getItem("selectedCountry"))?.id;
    if (countryId) {
      return this.productsService.getLoanProductWithCountryId(countryId);
    } else {
      return this.productsService.getLoanProducts();
    }
  }
}
