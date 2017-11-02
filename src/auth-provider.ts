import * as request from "request";

import { IValidResponse } from "./client.interface";

export class AuthProvider {
  private rSecureAddress: string;
  private clientId: string;
  private clientSecret: string;

  constructor(client: string, clientId: string, clientSecret: string) {
    this.rSecureAddress = client;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  public async validate(token: any) {
    return new Promise<IValidResponse>((resolve, reject) => {
      request.post(this.rSecureAddress + "/token/isValid", {
        body: {
          token,
        },
        json: true,
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return reject(err || response.body);
        } else if (body.valid) {
          body.token = token;
        }
        return resolve(body);
      });
    });
  }
}
