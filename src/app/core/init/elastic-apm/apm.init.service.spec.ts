import { TestBed } from '@angular/core/testing';

import { ApmInitService } from './apm.init.service';
import { ApmService } from '@elastic/apm-rum-angular';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { environment } from 'environments/environment';

describe('ApmInitService', () => {
  let service: ApmInitService;
  let apmService: jasmine.SpyObj<ApmService>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let mockApm: jasmine.SpyObj<any>;

  beforeEach(() => {
    const apmSpy = jasmine.createSpyObj('ApmService', ['init']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getConnectedUsername']);
    mockApm = jasmine.createSpyObj('MockApm', ['setUserContext']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApmService, useValue: apmSpy },
        { provide: AuthenticationService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(ApmInitService);
    apmService = TestBed.inject(ApmService) as jasmine.SpyObj<ApmService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize APM when environment.apm.serviceName is provided', async () => {
    const originalEnv = environment.apm;
    environment.apm = {
      serviceName: 'test-service',
      serverUrl: 'http://localhost:8200'
    };

    apmService.init.and.returnValue(mockApm);
    authenticationService.getConnectedUsername.and.returnValue('testuser');

    await service.init();

    expect(apmService.init).toHaveBeenCalledWith({
      serviceName: 'test-service',
      serverUrl: 'http://localhost:8200'
    });
    expect(authenticationService.getConnectedUsername).toHaveBeenCalled();
    expect(mockApm.setUserContext).toHaveBeenCalledWith({
      username: 'testuser',
      id: 'testuser'
    });

    environment.apm = originalEnv;
  });

  it('should not initialize APM when environment.apm.serviceName is not provided', async () => {
    const originalEnv = environment.apm;
    environment.apm = undefined;

    await service.init();

    expect(apmService.init).not.toHaveBeenCalled();
    expect(authenticationService.getConnectedUsername).not.toHaveBeenCalled();

    environment.apm = originalEnv;
  });

  it('should resolve promise even when APM is not initialized', async () => {
    const originalEnv = environment.apm;
    environment.apm = null;

    const result = await service.init();

    expect(result).toBeUndefined();
    environment.apm = originalEnv;
  });
});