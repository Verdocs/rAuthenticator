import { Auth } from './lib';
import * as jwt from 'jwt-decode';

import { IClient } from './lib/client.interface';

export class RealsterOkta {

  public static cookie(options: IClient) {
    return function (req, res, next) {
      Auth.getProvider(options).then(async (auth) => {
        const idToken = req.cookies['id_token'];
        const accessToken = req.cookies['access_token'];
        try {
          const verifiedIdToken = await auth.verify(idToken, 'id_token');
          const verifiedAccessToken = await auth.verify(accessToken, 'access_token');

          if (verifiedIdToken && verifiedAccessToken) {
            req.access_token = jwt.decode(accessToken);
            req.id_token = jwt.decode(idToken);
            next();
          } else {
            res.status(401).send({
              'Error': 'Not Authenticated'
            })
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  }
}
