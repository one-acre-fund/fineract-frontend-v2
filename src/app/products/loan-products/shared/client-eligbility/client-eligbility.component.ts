import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mifosx-client-eligbility',
  templateUrl: './client-eligbility.component.html',
  styleUrls: ['./client-eligbility.component.scss']
})
export class ClientEligbilityComponent implements OnInit {
  @Input() loanProduct: any;
  constructor() { }

  ngOnInit(): void {
  }

}
