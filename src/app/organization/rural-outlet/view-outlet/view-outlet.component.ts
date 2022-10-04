import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from 'app/organization/organization.service';
import { MatDialog } from '@angular/material/dialog';

import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'mifosx-view-outlet',
  templateUrl: './view-outlet.component.html',
  styleUrls: ['./view-outlet.component.scss'],
})
export class ViewOutletComponent implements OnInit {
  retailOutletData: any;
  officeList: any;
  constructor(private organizationService: OrganizationService,
    private route: ActivatedRoute, private dialog: MatDialog, private router: Router) {
    const outletId = +this.route.snapshot.paramMap.get('id');
    this.getRuralOutlet(outletId);
  }

  ngOnInit(){}

  getRuralOutlet(outletId: number) {
    this.organizationService.getRuralOutletByOutletId(outletId).subscribe((res: any) => {
      this.retailOutletData = res;
      this.officeList = res?.offices.map(x => x.officeName).toString();
    });
  }

  deleteRuralOutlet() {
    const outletId = +this.route.snapshot.paramMap.get('id');
    const deleteOutletDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: this.retailOutletData.name }
    });
    deleteOutletDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.organizationService.deleteOutlet(outletId)
          .subscribe(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
          });
      }
    });
  }
}
