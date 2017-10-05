import { Auth } from './lib';
import * as express from 'express';
import * as jwtdecode from 'jwt-decode';

import { IValidResponse } from './lib/client.interface';

class rSecure {
  public static header(rSecureAddress: string) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const authorizationHeader = req.header('authorization') as string;
      const authenticationHeader = req.header('authentication') as string;
      if (authorizationHeader || authenticationHeader) {
        const auth = new Auth(rSecureAddress);
        let accessToken = authorizationHeader.split(' ')[1];
        let idToken = authenticationHeader.split(' ')[1];
        try {
          const validatedAccesstoken = await auth.validateAccessToken(accessToken, idToken);
          if (validatedAccesstoken) {
            if (validatedAccesstoken.token !== accessToken) {
              res.set('X-Access_Token', validatedAccesstoken.token);
            }
            req['user'] = { access_token: validatedAccesstoken.payload };
            next();
          }
        } catch (err) {
          return next({
            code: err.code,
            error: err.error
          });
        }
      } else {
        next();
      }
    }
  }
}

export { rSecure };
