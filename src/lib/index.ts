import * as request from 'request';

import { IDiscovery } from './discovery';

import { AuthProvider } from './okta';

export class Auth {
  public static async getProvider(discoverUrl: string) {
    const discovery = await this.discover(discoverUrl);
    const okta = new AuthProvider(discovery);
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
}
