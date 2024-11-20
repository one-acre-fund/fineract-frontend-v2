import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAgentService } from './user-agent.service';

@Injectable()
export class UserAgentInterceptor implements HttpInterceptor {
  constructor(private userAgentService: UserAgentService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userAgent = this.userAgentService.getUserAgent();
    
    const clonedRequest = req.clone({
      setHeaders: {
        'X-User-Agent': userAgent,
      },
    });

    return next.handle(clonedRequest);
  }
}
