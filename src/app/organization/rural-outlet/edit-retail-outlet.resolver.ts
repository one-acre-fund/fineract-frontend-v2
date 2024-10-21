import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationService } from '../organization.service';

@Injectable({
  providedIn: 'root'
})
export class EditRetailOutletResolver  {
  constructor(private organizationService: OrganizationService, private route: ActivatedRoute) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const retailOutletId  = route.paramMap.get('id');
    return this.organizationService.getRuralOutletByOutletId(retailOutletId);
  }
}
