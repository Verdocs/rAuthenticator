import { Auth } from './lib';
import * as jwtdecode from 'jwt-decode';

import { IValidResponse } from './lib/client.interface';

class RealsterOkta {
  public static cookie(rSecureAddress: string, cookieName: string) {
    return async (req, res, next) => {
      const auth = new Auth(rSecureAddress);
      let cookieValue: any;
      let accessToken: string;
      let idToken: string;
      try {
        cookieValue = JSON.parse(req.cookies[cookieName]);
        accessToken = cookieValue['access_token'];
        idToken = cookieValue['id_token'];
        const validatedAccesstoken = await auth.validateAccessToken(accessToken, idToken);
        if (validatedAccesstoken) {
          if (validatedAccesstoken.token !== accessToken) {
            res.set('X-Access_Token', validatedAccesstoken.token);
          }
          req.user = { access_token: validatedAccesstoken.payload };
          next();
        }
      } catch (err) {
        return next({
          code: err.code,
          error: err.error
        });
      }
    }
  }
}

export { RealsterOkta };
