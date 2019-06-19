import * as express from "express";

import { AuthProvider } from "./auth-provider";
import { IValidResponse } from "./client.interface";

class RAuthenticator {
  private static auth: AuthProvider;
  private static tokenNamespace: string;
  public static header(rSecureAddress: string, clientId: string, clientSecret: string, tokenNamespace: string) {
    RAuthenticator.auth = new AuthProvider(rSecureAddress, clientId, clientSecret);
    RAuthenticator.tokenNamespace = tokenNamespace;
    return RAuthenticator.middleware;
  }

  private static async middleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const authorizationHeader = req.header("authorization") as string;
      const authenticationHeader = req.header("authentication") as string;
      const user = {
        accessToken: null,
        clientToken: null,
        idToken: null,
        id: null,
      };
      if (authenticationHeader) {
        user.idToken = await RAuthenticator.validateHeaderToken(authenticationHeader);
      }
      if (authorizationHeader) {
        const validatedAccessToken = await RAuthenticator.validateHeaderToken(authorizationHeader);
        if (validatedAccessToken.payload.gty === "client-credentials") {
          user.clientToken = validatedAccessToken;
          user.accessToken = {
            payload: {
              sub: req.header("user-id")
            }
          };
          user.accessToken.payload[`${RAuthenticator.tokenNamespace}/profile_id`] = req.header("profile-id");
          user.accessToken.payload[`${RAuthenticator.tokenNamespace}/permissions`] = req.header("permissions") ? req.header("permissions").split(",") : '';
          user.accessToken.payload[`${RAuthenticator.tokenNamespace}/organization_id`] = req.header("organization-id");

        } else {
          user.accessToken = validatedAccessToken;
        }
        user.id = user.accessToken.payload.sub;
      }
      const key = "user";
      req[key] = user;
      next();
    } catch (err) {
      return next(err);
    }
  }

  private static async validateHeaderToken(headerToken) {
    const token = headerToken.split(" ")[1];
    if (token) {
      try {
        const validatedToken = await RAuthenticator.auth.validate(token);
        if (validatedToken.valid) {
          if (validatedToken.payload.hasOwnProperty('email_verified') && !validatedToken.payload.email_verified) {
            return Promise.reject({
              code: 401,
              error: 'email is not verified'
            });
          }
          return validatedToken;
        } else {
          return Promise.reject({
            code: 403,
            error: validatedToken
          });
        }
      } catch (err) {
        return Promise.reject({
          code: 500,
          error: err
        });
      }
    } else {
      return Promise.reject({
        code: 400,
        error: 'Invalid Bearer Token'
      });
    }
  }
}

export { RAuthenticator };
