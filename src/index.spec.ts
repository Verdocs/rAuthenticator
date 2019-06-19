import { expect } from "chai";
import * as express from "express";
import * as sinon from "sinon";

import { RAuthenticator } from "./index";
import { AuthProvider } from "./auth-provider";

let sandbox: sinon.SinonSandbox;

describe("RAuthenticator", () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  it("Should call next with 400 error without bearer", (done) => {
    const req: any = {
      header: (name) => {
        return name;
      }
    }

    const middleware = RAuthenticator.header(null, null, null, null)
    middleware(req, null, (err) => {
      try {
        expect(err).to.exist;
        expect(err.code).to.eq(400);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("Should call next with 403 error with bad token", (done) => {
    const validateStub = sandbox.stub(AuthProvider.prototype, "validate");
    validateStub.resolves({
      valid: false,
      reason: "fakereason"
    });
    const req: any = {
      header: (name) => {
        return "B " + name;
      }
    }

    const middleware = RAuthenticator.header(null, null, null, null)
    middleware(req, null, (err) => {
      try {
        expect(err).to.exist;
        expect(err.code).to.eq(403);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("Should call next with 500 error in network error", (done) => {
    const validateStub = sandbox.stub(AuthProvider.prototype, "validate");
    validateStub.rejects("network error");
    const req: any = {
      header: (name) => {
        return "B " + name;
      }
    }

    const middleware = RAuthenticator.header(null, null, null, null)
    middleware(req, null, (err) => {
      try {
        expect(err).to.exist;
        expect(err.code).to.eq(500);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("Should call next without error with good token password grant type", (done) => {
    const tokenResult = {
      valid: true,
      token: "fakeToken",
      payload: {
        sub: "fakesub",
        gty: "password"
      }
    };
    const validateStub = sandbox.stub(AuthProvider.prototype, "validate");
    validateStub.resolves(tokenResult);
    const req: any = {
      header: (name) => {
        return "B " + name;
      }
    }

    const middleware = RAuthenticator.header(null, null, null, null)
    middleware(req, null, (err) => {
      try {
        expect(err).to.not.exist;
        expect(req.user).to.exist;
        expect(req.user.accessToken).to.be.eq(tokenResult);
        expect(req.user.clientToken).to.be.eq(null);
        expect(req.user.idToken).to.be.eq(tokenResult);
        expect(req.user.id).to.be.eq(tokenResult.payload.sub);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("Should call next without error with good token password grant type, no id token", (done) => {
    const tokenResult = {
      valid: true,
      token: "fakeToken",
      payload: {
        sub: "fakesub",
        gty: "password"
      }
    };
    const validateStub = sandbox.stub(AuthProvider.prototype, "validate");
    validateStub.resolves(tokenResult);
    const req: any = {
      header: (name) => {
        if (name === "authentication") {
          return null;
        }
        return "B " + name;
      }
    }

    const middleware = RAuthenticator.header(null, null, null, null)
    middleware(req, null, (err) => {
      try {
        expect(err).to.not.exist;
        expect(req.user).to.exist;
        expect(req.user.accessToken).to.be.eq(tokenResult);
        expect(req.user.clientToken).to.be.eq(null);
        expect(req.user.idToken).to.be.eq(null);
        expect(req.user.id).to.be.eq(tokenResult.payload.sub);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("Should call next without error with good token password grant type, no access token", (done) => {
    const tokenResult = {
      valid: true,
      token: "fakeToken",
      payload: {
        sub: "fakesub",
        gty: "password"
      }
    };
    const validateStub = sandbox.stub(AuthProvider.prototype, "validate");
    validateStub.resolves(tokenResult);
    const req: any = {
      header: (name) => {
        if (name === "authorization") {
          return null;
        }
        return "B " + name;
      }
    }

    const middleware = RAuthenticator.header(null, null, null, null)
    middleware(req, null, (err) => {
      try {
        expect(err).to.not.exist;
        expect(req.user).to.exist;
        expect(req.user.accessToken).to.be.eq(null);
        expect(req.user.clientToken).to.be.eq(null);
        expect(req.user.idToken).to.be.eq(tokenResult);
        expect(req.user.id).to.be.eq(null);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("Should call next without error with good token client grant type", (done) => {
    const tokenResult = {
      valid: true,
      token: "fakeToken",
      payload: {
        sub: "fakesub",
        gty: "client-credentials"
      }
    };
    const validateStub = sandbox.stub(AuthProvider.prototype, "validate");
    validateStub.resolves(tokenResult);
    const req: any = {
      header: (name) => {
        return "B " + name;
      }
    }

    const middleware = RAuthenticator.header(null, null, null, null)
    middleware(req, null, (err) => {
      try {
        expect(err).to.not.exist;
        expect(req.user).to.exist;
        expect(req.user.accessToken.payload.sub).to.be.eq("B user-id");
        expect(req.user.idToken).to.be.eq(tokenResult);
        expect(req.user.clientToken).to.be.eq(tokenResult);
        expect(req.user.id).to.be.eq("B user-id");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});

