import { Auth } from './lib';
import * as express from 'express';
import * as jwtdecode from 'jwt-decode';

import { IValidResponse } from './lib/client.interface';

class rSecure {
  public static header(rSecureAddress: string) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const authorizationHeader = req.header('authorization') as string;
        const authenticationHeader = req.header('authentication') as string;
        let user = {
          accessToken: null,
          idToken: null
        }
        let idToken, validateIdToken, accessToken, validatedAccesstoken;
        const auth = new Auth(rSecureAddress);
        if (authenticationHeader) {
          idToken = authenticationHeader.split(' ')[1];
          validateIdToken = await auth.validateIdToken(idToken);
          user.idToken = validateIdToken;
        }
        if (authorizationHeader) {
          accessToken = authorizationHeader.split(' ')[1];
          validatedAccesstoken = await auth.validateAccessToken(accessToken, idToken);
          if (validatedAccesstoken) {
            if (validatedAccesstoken.token !== accessToken) {
              res.set('X-Access-Token', validatedAccesstoken.token);
            }
            user.accessToken = validatedAccesstoken
          }
        }
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
