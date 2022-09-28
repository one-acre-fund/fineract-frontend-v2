import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrganizationService } from "app/organization/organization.service";

@Component({
  selector: "mifosx-view-outlet",
  templateUrl: "./view-outlet.component.html",
  styleUrls: ["./view-outlet.component.scss"],
})
export class ViewOutletComponent implements OnInit {
  retailOutletData: any;
  constructor(private organizationService: OrganizationService,private route: ActivatedRoute) {
    let outletId= +this.route.snapshot.paramMap.get('id');
    this.getRuralOutlet(outletId);
  }

  ngOnInit(): void {}

  getRuralOutlet(outletId:number) {
    this.organizationService.getRuralOutletByOutletId(outletId).subscribe((res) => {
      this.retailOutletData=res;
    });
  }
}
