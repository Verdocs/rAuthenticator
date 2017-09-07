import * as request from 'request';

import { IDiscovery } from './discovery';

export class AuthProvider {
  private discoveryResult: IDiscovery;
  private keyStore: any;

  constructor(discovery: IDiscovery) {
    this.discoveryResult = discovery;
  }

  public async verify(token: any, type: string) {
    return new Promise<Boolean>((resolve, reject) => {
      request.post(this.discoveryResult.introspection_endpoint, {
        form: {
          token: token,
          token_type_hint: type
        }
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err);
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
