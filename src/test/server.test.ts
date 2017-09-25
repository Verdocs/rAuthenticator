import * as chai from 'chai';
import * as request from 'supertest';
import * as config from 'config';
import * as _ from 'lodash';

import { app } from './server';

function createCookie(accessToken: string, idToken: string){
  return JSON.stringify({
    access_token: accessToken,
    id_token: idToken
  });
}

describe('Test Express Server', () => {
  it('Should return error', (done) => {
    request(app)
      .get('/')
      .set('Cookie', [`rSecure=${createCookie('1234','1234')}`])
      .expect(403)
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
          const body = response.body;
          chai.expect(body.reason).to.be.equal('signature');
          done();
        }
      });
  });

  it('Should return tokens', (done) => {
    const accessToken = config.get<string>('testAccessToken');
    const idToken = config.get<string>('testIdToken');
    request(app)
      .get('/')
      .set('Cookie', [`rSecure=${createCookie(accessToken,idToken)}`])
      .expect(200)
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
          const body = response.body;
          chai.expect(body.access_token).to.be.exist;
          done();
        }
      });
  });
})
