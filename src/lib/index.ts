import * as request from 'request';

import { AuthProvider } from './okta';

import { IClient, IDiscovery } from './client.interface';

export class Auth {
  public static async getProvider(client: IClient) {
    client.discovery = await this.discover(client.discoverUrl);
    const okta = new AuthProvider(client);
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
