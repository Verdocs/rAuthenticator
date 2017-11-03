import { expect } from "chai";
import * as request from "request";
import * as sinon from "sinon";

import { AuthProvider } from "./auth-provider";

let sandbox: sinon.SinonSandbox;

describe("Auth Provider", () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  it("Should return valid true with token", async () => {
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
    const result = await validatePromise
    expect(result.token).to.be.eq(fakeValidToken);
    expect(result.valid).to.be.eq(true);
  });

  it("Should return valid false, with reason", async () => {
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
    const result = await validatePromise
    expect(result.reason).to.be.equal(fakeReason);
    expect(result.token).not.exist;
    expect(result.valid).to.be.eq(false);
  });

  it("Should reject if network error", async () => {
    const networkRequestStub = sandbox.stub(request, "post");
    const authProvider = new AuthProvider(null, null, null);
    const fakeInvalidToken = "fakeToken";
    const validatePromise = authProvider.validate(fakeInvalidToken);
    const fakeError = "fakeNetworkError";
    networkRequestStub.yield(fakeError, null, null);
    try {
      const result = await validatePromise;
      return result;
    } catch (err) {
      expect(err).to.be.eq(fakeError);
    }
  });

  it("Should reject if statuscode not 200", async () => {
    const networkRequestStub = sandbox.stub(request, "post");
    const authProvider = new AuthProvider(null, null, null);
    const fakeInvalidToken = "fakeToken";
    const validatePromise = authProvider.validate(fakeInvalidToken);
    const fakeBody = "fakeErrorInBody";
    networkRequestStub.yield(null, {
      statusCode: 400,
      body: fakeBody
    }, null);
    try {
      const result = await validatePromise;
      return result;
    } catch (err) {
      expect(err).to.be.eq(fakeBody);
    }
  });

  afterEach(() => {
    sandbox.restore();
  });
});
