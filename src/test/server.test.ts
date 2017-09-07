import { app } from './server';
import * as request from 'supertest';

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
  })
})
