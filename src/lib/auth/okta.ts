import * as request from 'request';
import * as jose from 'node-jose';

import { IDiscovery, IJWK } from './discovery';

export class AuthProvider {
  private discoveryResult: IDiscovery;
  private keyStore: any;

  constructor(discovery: IDiscovery) {
    this.discoveryResult = discovery;
  }

  public async getJWKs() {
    return new Promise<any>((resolve, reject) => {
      request.get(this.discoveryResult.jwks_uri, {
        json: true
      }, async (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err);
        } else {
          this.keyStore = await jose.JWK.asKeyStore(body.keys);
          return resolve(this.keyStore);
        }
      })
    });
  }

  public getKey(kid: string) {
    return this.keyStore.get(kid);
  }

  public async verify(token: any) {
    try {
      const result = await jose.JWS.createVerify(this.keyStore).verify(token);
      const payload = result.payload as Buffer;
      return payload.toString();
    } catch (err) {
      return Promise.reject({
        error: 'Not a Valid Token'
      });
    }
  }

  public async introspect(token: any) {
    return new Promise<Boolean>((resolve, reject) => {
      request.post(this.discoveryResult.introspection_endpoint, {
        form: {
          token: token,
          token_type_hint: 'access_token'
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
