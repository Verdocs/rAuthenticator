import { Auth } from './lib';

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
      next();
    } else {
      next({
        verifiedIdToken: verifiedIdToken,
        verifiedAccessToken: verifiedAccessToken
      });
    }
  }
}
