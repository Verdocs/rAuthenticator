import * as request from 'request';

import { IValidResponse } from './client.interface';

export class AuthProvider {
  private rSecureAddress: string;
  private clientId: string;
  private clientSecret: string;

  constructor(client: string, clientId: string, clientSecret: string) {
    this.rSecureAddress = client;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  public async getAccessToken(access_token: string) {
    return new Promise<string>((resolve, reject) => {
      request.post(this.rSecureAddress + `/token/get_access_token`, {
        headers: {
          'client_id': this.clientId,
          'client_secret': this.clientSecret
        },
        json: true,
        body: {
          token: access_token
        }
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || response.body);
        } else {
          resolve(body.accessToken);
        }
      });
    });
  }

  public async getIdToken(id_token: string) {
    return new Promise<string>((resolve, reject) => {
      request.post(this.rSecureAddress + `/token/get_id_token`, {
        headers: {
          'client_id': this.clientId,
          'client_secret': this.clientSecret
        },
        json: true,
        body: {
          token: id_token
        }
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || response.body);
        } else {
          resolve(body.idToken);
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
