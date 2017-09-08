import * as chai from 'chai';
import * as request from 'supertest';
import * as config from 'config';
import * as _ from 'lodash';

import { app } from './server';

describe('Test Express Server', () => {
  it('Should return error', (done) => {
    request(app)
      .get('/')
      .set('Cookie', ['access_token=12345667', 'id_token=blah'])
      .expect(200)
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
          const body = response.body;
          const idTokenResult = _.find<any>(body, {name: 'id_token'});
          const accessTokenResult = _.find<any>(body, {name: 'access_token'});
          chai.expect(idTokenResult.verified).to.be.equal(false);
          chai.expect(accessTokenResult.verified).to.be.equal(false);
          done();
        }
      });
  });

  it('Should return tokens', (done) => {
    const accessToken = config.get<string>('testAccessToken');
    const idToken = config.get<string>('testIdToken');
    request(app)
      .get('/')
      .set('Cookie', [`access_token=${accessToken}`, `id_token=${idToken}`])
      .expect(200)
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
          const body = response.body;
          const idTokenResult = _.find<any>(body, {name: 'id_token'});
          const accessTokenResult = _.find<any>(body, {name: 'access_token'});
          chai.expect(idTokenResult.verified).to.be.equal(true);
          chai.expect(accessTokenResult.verified).to.be.equal(true);
          done();
        }
      });
  });
})
