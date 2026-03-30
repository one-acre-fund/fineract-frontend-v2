import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';

import { OrganizationService } from '../../organization.service';
import { ProductsService } from 'app/products/products.service';
import { BaseExportDownloadComponent } from '../base-export-download.class';

@Component({
  selector: 'mifosx-unqualified-farmers-download',
  templateUrl: './unqualified-farmers-download.component.html',
  styleUrls: ['./unqualified-farmers-download.component.scss']
})
export class UnqualifiedFarmersDownloadComponent extends BaseExportDownloadComponent {
  readonly exportType = 'unqualified';

  constructor(
    route: ActivatedRoute,
    formBuilder: UntypedFormBuilder,
    organizationService: OrganizationService,
    productsService: ProductsService
  ) {
    super(route, formBuilder, organizationService, productsService);
  }
}
