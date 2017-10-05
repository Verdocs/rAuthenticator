import * as request from 'request';

import { AuthProvider } from './rSecure';

import { IValidResponse } from './client.interface';

export class Auth {
  private rSecure: AuthProvider;

  constructor(rSecureAddress: string) {
    this.rSecure = new AuthProvider(rSecureAddress);
  }

  public async validateAccessToken(accessToken: string, idToken: string) {
    try {
      let validatedToken = await this.rSecure.validate(accessToken);
      if (validatedToken.valid) {
        return validatedToken;
      } else if (validatedToken.reason === 'expired') {
        const newAccessToken = await this.getNewAccessToken(idToken);
        if (newAccessToken) {
          validatedToken = await this.rSecure.validate(newAccessToken);
          return validatedToken;
        }
      }
    } catch (err) {
      if (err.reason === 'signature') {
        return Promise.reject({
          code: 403,
          error: err
        });
      } else {
        return Promise.reject({
          code: 500,
          error: err
        });
      }
    }
    return Promise.reject(null);
  }

  public async validateIdToken(idToken: string) {
    try {
      const validatedToken = await this.rSecure.validate(idToken);
      return validatedToken;
    } catch (err) {
      return Promise.reject({
        code: 403,
        error: err
      });
    }
  }

  private async getNewAccessToken(idToken: string) {
    try {
      return await this.rSecure.getAccessToken(idToken);
    } catch (err) {
      if (err.code === 'T000002' || err.code === 'T000003') {
        return Promise.reject({
          code: 403,
          error: err
        });
      } else {
        return Promise.reject({
          code: 500,
          error: err
        });
      }
    }
  }
}
