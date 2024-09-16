/** Angular Imports */
import { Injectable } from '@angular/core';


/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { UserService } from '../user.service';

/** Custom Model */
import { User } from '../user.model';

/**
 * View self service user data resolver.
 */
@Injectable()
export class ViewUserResolver  {

  /**
   * @param {UserService} userService Self service user service.
   */
  constructor(private userService: UserService) {}

  /**
   * Returns the user data.
   * @returns {Observable<User>}
   */
  resolve(): Observable<User> {
    return this.userService.getUser();
  }

}
