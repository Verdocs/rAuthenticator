import * as request from 'request';

import { AuthProvider } from './rSecure';

import { IValidResponse } from './client.interface';

export class Auth {
  private rSecure: AuthProvider;

  constructor(rSecureAddress: string) {
    this.rSecure = new AuthProvider(rSecureAddress);
  }

  public async validateAccessToken(accessToken: string) {
    try {
      let validatedToken = await this.rSecure.validate(accessToken);
      if (validatedToken.valid) {
        return validatedToken;
      } else if (validatedToken.reason === 'expired') {
        const newAccessToken = await this.getNewAccessToken(accessToken);
        if (newAccessToken) {
          validatedToken = await this.rSecure.validate(newAccessToken);
          return validatedToken;
        }
      } else {
        return Promise.reject({
          code: 403,
          error: 'Cannot get new'
        })
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
      let validatedToken = await this.rSecure.validate(idToken);
      if (validatedToken.valid) {
        return validatedToken;
      } else if (validatedToken.reason === 'expired') {
        const newAccessToken = await this.getNewIdToken(idToken);
        if (newAccessToken) {
          validatedToken = await this.rSecure.validate(newAccessToken);
          return validatedToken;
        }
      } else {
        return Promise.reject({
          code: 403,
          error: 'Cannot get new'
        })
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

  private async getNewAccessToken(accessToken: string) {
    try {
      return await this.rSecure.getAccessToken(accessToken);
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

  private async getNewIdToken(idToken: string) {
    try {
      return await this.rSecure.getIdToken(idToken);
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
