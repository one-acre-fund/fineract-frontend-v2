/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { OrganizationService } from 'app/organization/organization.service';
/**
 * Countries data resolver.
 */
@Injectable()
export class CountriesResolver  {

    /**
     * @param {OrganizationService} OrganizationService Organization service.
     */
    constructor(private organizationService: OrganizationService) { }

    /**
     * Returns the Countries data.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
        return this.organizationService.getCountries();
    }

}
