/** Angular Imports */
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { ClientFamilyMemberDialogComponent } from './client-family-member-dialog/client-family-member-dialog.component';
import { MatomoTracker } from "@ngx-matomo/tracker";

/**
 * Client Family Members Step
 */
@Component({
  selector: 'mifosx-client-family-members-step',
  templateUrl: './client-family-members-step.component.html',
  styleUrls: ['./client-family-members-step.component.scss']
})
export class ClientFamilyMembersStepComponent implements OnInit {

  /** Cient Template */
  @Input() clientTemplate: any;
  /** Client Family Members */
  clientFamilyMembers: any[] = [];

  /**
   * @param {MatDialog} dialog Mat Dialog
   * @param {MatomoTracker} matomoTracker Matomo tracker service
   */
  constructor(public dialog: MatDialog, private matomoTracker: MatomoTracker) { }

  ngOnInit() {
    //set Matomo page info
    const title = document.title;
    this.matomoTracker.setDocumentTitle(`${title}`);
  }

  /**
   * Adds a family member.
   */
  addFamilyMember() {
    const addFamilyMemberDialogRef = this.dialog.open(ClientFamilyMemberDialogComponent, {
      data: {
        context: 'Add',
        options: this.clientTemplate.familyMemberOptions,
      },
      width: '50rem'
    });
    addFamilyMemberDialogRef.afterClosed().subscribe((response: any) => {
      if (response.member) {
        this.clientFamilyMembers.push(response.member);
      }
    });
    //Matomo log activity
    this.matomoTracker.trackEvent('clients', 'addFamilyMember');// change to track right info
  }

  /**
   * Edits the family member.
   * @param {any} member Family Member
   * @param {any} index Tree Index
   */
  editFamilyMember(member: any, index: any) {
    const addFamilyMemberDialogRef = this.dialog.open(ClientFamilyMemberDialogComponent, {
      data: {
        context: 'Edit',
        member: member,
        options: this.clientTemplate.familyMemberOptions,
      },
      width: '50rem'
    });
    addFamilyMemberDialogRef.afterClosed().subscribe((response: any) => {
      if (response.member) {
        this.clientFamilyMembers.splice(index, 1, response.member);
      }
    });
    //Matomo log activity
    this.matomoTracker.trackEvent('clients', 'editFamilyMember');// change to track right info
  }

  /**
   * Deletes the family member
   */
  deleteFamilyMember(name: string, index: number) {
    const deleteFamilyMemberDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `Family member name : ${name} ${index}` }
    });
    deleteFamilyMemberDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.clientFamilyMembers.splice(index, 1);
      }
    });
    //Matomo log activity
    this.matomoTracker.trackEvent('clients', 'deleteFamilyMember');// change to track right info
  }

  /**
   * Returns the array of client family members.
   */
  get familyMembers() {
    return { familyMembers: this.clientFamilyMembers };
  }

}
