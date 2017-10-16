import { Auth } from './lib';
import * as express from 'express';
import * as jwtdecode from 'jwt-decode';

import { IValidResponse } from './lib/client.interface';

class rSecure {
  public static header(rSecureAddress: string, clientId: string, clientSecret: string) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const authorizationHeader = req.header('authorization') as string;
        const authenticationHeader = req.header('authentication') as string;
        let user = {
          accessToken: null,
          idToken: null,
          clientToken: null
        }
        let idToken, validateIdToken, accessToken, validatedAccesstoken;
        const auth = new Auth(rSecureAddress, clientId, clientSecret);
        if (authenticationHeader) {
          idToken = authenticationHeader.split(' ')[1];
          validateIdToken = await auth.validateIdToken(idToken);
          if (validateIdToken) {
            if (validateIdToken.token !== idToken) {
              res.set('X-Id-Token', validateIdToken.token);
            }
            user.idToken = validateIdToken;
          }
        }
        if (authorizationHeader) {
          accessToken = authorizationHeader.split(' ')[1];
          validatedAccesstoken = await auth.validateAccessToken(accessToken);
          if (validatedAccesstoken) {
            if (validatedAccesstoken.token !== accessToken) {
              res.set('X-Access-Token', validatedAccesstoken.token);
            }
            if (validatedAccesstoken.payload.gty === 'client-credentials') {
              user.clientToken = validatedAccesstoken;
              user.accessToken = {
                payload:{
                  sub: req.header('user-id')
                }
              }
            } else {
              user.accessToken = validatedAccesstoken;
            }
          }
        }
        res.set('Access-Control-Expose-Headers', 'X-Access-Token, X-Id-Token');
        req['user'] = user;
        next();
      } catch (err) {
        return next({
          code: err.code,
          error: err.error
        });
      }
    }
  }
}

export { rSecure };
