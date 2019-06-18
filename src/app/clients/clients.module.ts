/** Angular Imports */
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

/** Custom Modules */
import { ClientsRoutingModule } from './clients-routing.module';
import { SharedModule } from 'app/shared/shared.module';

/** Custom Components */
import { ClientsComponent } from './clients.component';
import { ClientsViewComponent } from './clients-view/clients-view.component';
import { GeneralTabComponent } from './clients-view/general-tab/general-tab.component';
import {PipesModule} from '../pipes/pipes.module';
import { FamilyMembersTabComponent } from './clients-view/family-members-tab/family-members-tab.component';
import { AddFamilyMemberComponent } from './clients-view/family-members-tab/add-family-member/add-family-member.component';
import { EditFamilyMemberComponent } from './clients-view/family-members-tab/edit-family-member/edit-family-member.component';


/**
 * Clients Module
 *
 * All components related to Clients should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    ClientsRoutingModule,
    PipesModule
  ],
  declarations: [
    ClientsComponent,
    ClientsViewComponent,
    GeneralTabComponent,
    FamilyMembersTabComponent,
    AddFamilyMemberComponent,
    EditFamilyMemberComponent
  ],
  providers: [DatePipe]

})
export class ClientsModule { }