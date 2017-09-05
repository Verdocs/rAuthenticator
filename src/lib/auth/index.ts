import * as request from 'request';
import * as config from 'config';

import { IDiscovery } from './discovery';

import { AuthProvider } from './okta';

export class Auth {
  public static async getProvider(discoverUrl: string) {
    const discovery = await this.discover(discoverUrl);
    const okta = new AuthProvider(discovery);
    await okta.getJWKs();
    return okta;
  }

  private static async discover(url: string) {
    return new Promise<IDiscovery>((resolve, reject) => {
      request.get(url, {
        json: true
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || response.body);
        } else {
          return resolve(body);
        }
      });
    })
  }

  public static middleWare(req, res, next) {
    Auth.getProvider(config.get<string>('okta.discover'))
      .then(async (provider) => {
        try {
          const authorizationHeader = req.header('Authorization');
          const token = authorizationHeader.split(' ')[1];
          const result = await provider.verify(token);
          next();
        } catch (err) {
          // res.status(400).send(err);
          return Promise.reject(err);
        }
      }).catch((err) => {
        res.status(400).send(err);
      });
  }
}
