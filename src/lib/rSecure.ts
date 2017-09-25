import * as request from 'request';

import { IValidResponse } from './client.interface';

export class AuthProvider {
  private rSecureAddress: string;

  constructor(client: string) {
    this.rSecureAddress = client;
  }

  public async getAccessToken(id_token: string) {
    return new Promise<string>((resolve, reject) => {
      request.get(this.rSecureAddress + `/token/accessToken?id_token=${id_token}`, {
        json: true
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || response.body);
        } else {
          resolve(body.access_token);
        }
      });
    });
  }

  public async validate(token: any) {
    return new Promise<IValidResponse>((resolve, reject) => {
      request.post(this.rSecureAddress + '/token/isValid', {
        body: {
          token: token,
        },
        json: true
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || response.body);
        } else if (body.reason !== 'signature') {
          body.token = token;
          return resolve(body);
        } else {
          return reject(body);
        }
      });
    });
  }
}
