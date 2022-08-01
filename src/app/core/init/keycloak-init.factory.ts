import { environment } from 'environments/environment'
import { KeycloakService } from 'keycloak-angular'
import { AuthenticationService } from '../authentication/authentication.service'
import { OAuth2Token } from '../authentication/o-auth2-token.model'
export function initializer (keycloak: KeycloakService, authService: AuthenticationService): () => Promise<any> {
  let service = authService
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak
          .init({
            config: {
              url: `${environment.oauth.serverUrl}`,
              realm: `${environment.oauth.realm}`,
              clientId: `${environment.oauth.client_id}`,
            },
            initOptions: {
              onLoad: 'login-required',
              checkLoginIframe: true,
              redirectUri: `${environment.oauth.redirectUri}`,
            },

            loadUserProfileAtStartUp: true,
            enableBearerInterceptor: true,
            bearerExcludedUrls: [],
            bearerPrefix: 'Bearer'
          })
          .then(response => {
            keycloak.isLoggedIn().then(isLoggedIn => {
              debugger
              let isAuthenticated=service.isAuthenticated();
              if (isLoggedIn && !isAuthenticated) {
                  keycloak.getToken().then(token => {
                    let context: OAuth2Token = {
                      scope: 'openid email profile',
                      token_type: 'Bearer',
                      access_token: token,
                      expires_in: 12955743,
                      refresh_token: token,
                      username:keycloak.getUsername()
                    }
                    service.getUserDetails(context)
                  })
              }
              resolve(isLoggedIn)
            })
          })
        resolve
      } catch (error) {
        reject(error)
      }
    })
  }
}
