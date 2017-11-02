import { expect } from "chai";
import * as request from "request";
import * as sinon from "sinon";

import { AuthProvider } from "./auth-provider";

let sandbox: sinon.SinonSandbox;

describe("Auth Provider", () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  it("Should return valid true with token", (done) => {
    const validRequestStub = sandbox.stub(request, "post");
    const authProvider = new AuthProvider(null, null, null);
    const fakeValidToken = "fakeToken";
    const validatePromise = authProvider.validate(fakeValidToken);
    validRequestStub.yield(null, {
      statusCode: 200,
    }, {
        valid: true,
      },
    );
    validatePromise.then((result) => {
      expect(result.token).to.be.eq(fakeValidToken);
      expect(result.valid).to.be.eq(true);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  it("Should return valid false, with reason", (done) => {
    const inValidRequestStub = sandbox.stub(request, "post");
    const authProvider = new AuthProvider(null, null, null);
    const fakeInvalidToken = "fakeToken";
    const validatePromise = authProvider.validate(fakeInvalidToken);
    const fakeReason = "fakeReason";
    inValidRequestStub.yield(null, {
      statusCode: 200,
    }, {
        reason: fakeReason,
        valid: false,
      },
    );
    validatePromise.then((result) => {
      expect(result.reason).to.be.equal(fakeReason);
      expect(result.token).not.exist;
      expect(result.valid).to.be.eq(false);
      done();
    }).catch((err) => {
      done(err);
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
});
