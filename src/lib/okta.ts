import * as request from 'request';

import { IClient, IDiscovery } from './client.interface';

export class AuthProvider {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  public async verify(token: any, type: string) {
    return new Promise<Boolean>((resolve, reject) => {
      request.post(this.client.discovery.introspection_endpoint, {
        form: {
          token: token,
          token_type_hint: type,
          client_id: this.client.clientId,
          client_secret: this.client.clientSecret
        },
        json: true
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || response.body);
        } else {
          if (body.active) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      })
    })
  }
}
