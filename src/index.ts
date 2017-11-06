import * as express from "express";
import * as jwtdecode from "jwt-decode";

import { AuthProvider } from "./auth-provider";
import { IValidResponse } from "./client.interface";

class RAuthenticator {
  private static auth: AuthProvider;
  public static header(rSecureAddress: string, clientId: string, clientSecret: string) {
    RAuthenticator.auth = new AuthProvider(rSecureAddress, clientId, clientSecret);
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
        const validatedAccesstoken = await RAuthenticator.validateHeaderToken(authorizationHeader);
        if (validatedAccesstoken.payload.gty === "client-credentials") {
          user.clientToken = validatedAccesstoken;
          user.accessToken = {
            payload: {
              sub: req.header("user-id"),
              'https://gorealster.com/profile_id': req.header("profile-id")
            },
          };
        } else {
          user.accessToken = validatedAccesstoken;
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
