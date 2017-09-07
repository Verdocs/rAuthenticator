import * as chai from 'chai';
import * as request from 'supertest';
import * as config from 'config';

import { app } from './server';

describe('Test Express Server', () => {
  it('Should return error', (done) => {
    request(app)
      .get('/')
      .set('Cookie', ['access_token=12345667', 'id_token=blah'])
      .expect(401)
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
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
          chai.expect(body.access_token).to.exist;
          chai.expect(body.id_token).to.exist;
          done();
        }
      });
  });
})
