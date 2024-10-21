/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { CollectionsService } from '../collections.service';

/**
 * Returns all the offices data.
 */
@Injectable()
export class GetOfficesResolver  {

    /**
     * @param {CollectionsService} CollectionsService Collections service.
     */
    constructor(private collectionsService: CollectionsService) { }

    /**
     * Returns the Collection Office Data.
     * @returns {Observable<any>}
     */
    resolve(): Observable<any> {
        return this.collectionsService.getOffices();
    }

}
