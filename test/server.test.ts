import { app } from './server';
import * as request from 'supertest';

describe('Test Express Server', () => {
  it('Should return error', (done) => {
    return request(app)
    .get('/')
    .set('Cookie', ['access_token=12345667', 'id_token=blah'])
    .expect(401, done)
  })
})
