import { Auth } from './lib';
import * as jwtdecode from 'jwt-decode';

import { IClient } from './lib/client.interface';

class RealsterOkta {
  public static cookie(client: IClient, tokenNames: string[]) {
    return function (req, res, next) {
      Auth.getProvider(client).then(async (auth) => {
        const result = [];
        try {
          for (const tokenName of tokenNames) {
            const token = req.cookies[tokenName];
            const verifiedToken = await auth.verify(token, tokenName);
            if (verifiedToken) {
              result.push({
                name: tokenName,
                verified: true,
                decoded: jwtdecode(token)
              });
            } else {
              result.push({
                name: tokenName,
                verified: false,
                decoded: null
              });
            }
          }
          req.verifiedCookies = result;
          next();
        } catch (err) {
          next({
            code: 500,
            error: err
          });
        }
      });
    }
  }
}

export { IClient, RealsterOkta };
