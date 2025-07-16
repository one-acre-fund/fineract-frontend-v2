import { Injectable } from '@angular/core';
import { ApmService } from '@elastic/apm-rum-angular';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { environment } from 'environments/environment';


export function apmInitializer(apmInitService: ApmInitService) {
  return () => apmInitService.init();
}

@Injectable({
  providedIn: 'root'
})
export class ApmInitService {

  constructor(
    private apmService: ApmService,
    private authenticationService: AuthenticationService,
  ) {}

  init(): Promise<void> {
    return new Promise((resolve) => {
      if (environment.apm?.serviceName) {
        const apm = this.apmService.init({
          serviceName: environment.apm.serviceName,
          serverUrl: environment.apm.serverUrl
        });

        var username = this.authenticationService.getConnectedUsername();
        apm.setUserContext({
          username: username,
          id: username
        })
      }
      resolve();
    });
  }
}
