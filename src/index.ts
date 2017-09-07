import { Auth } from './lib';
import * as jwt from 'jwt-decode';

export class RealsterOkta {
  private disvcoverUrl: string;

  constructor(discoverUrl: string) {
    this.disvcoverUrl = discoverUrl;
  }

  public async cookie(req, res, next) {
    const auth = await Auth.getProvider(this.disvcoverUrl);
    const idToken = req.cookies['id_token'];
    const accessToken = req.cookies['access_token'];
    const verifiedIdToken = await auth.verify(idToken, 'id_token');
    const verifiedAccessToken = await auth.verify(accessToken, 'access_token');
    if (verifiedIdToken && verifiedAccessToken) {
      req.access_token = jwt.decode(accessToken);
      req.id_token = jwt.decode(idToken);
      next();
    } else {
      next({
        verifiedIdToken: verifiedIdToken,
        verifiedAccessToken: verifiedAccessToken
      });
    }
  }
}
