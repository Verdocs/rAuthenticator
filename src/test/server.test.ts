import * as chai from 'chai';
import * as supertest from 'supertest';
import * as request from 'request';
import * as config from 'config';
import * as _ from 'lodash';

import { app } from './server';


let accessToken: string;
let idToken: string;

describe('Test Express Server', () => {
  before((done) => {
    request.post(`${config.get<string>('rSecure_Url')}/authorization/login`, {
      body: {
        username: config.get<string>('testAccount_username'),
        password: config.get<string>('testAccount_password')
      },
      json: true
    }, (err, response, body) => {
      if (err) {
        done(err);
      } else {
        accessToken = body[0].accessToken;
        idToken = body[0].idToken;
        done();
      }
    });
  });

  it('Should return error', (done) => {
    supertest(app)
      .get('/')
      .set('authorization', `Bearer 1234`)
      .set('authentication', `Bearer 1234`)
      .expect(403)
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
          const body = response.body;
          chai.expect(response.statusCode).to.be.equal(403);
          chai.expect(body.valid).to.be.equal(false);
          chai.expect(body.reason).to.be.equal('signature');
          done();
        }
      });
  });

  it('Should return tokens', (done) => {
    supertest(app)
      .get('/')
      .set('authorization', `Bearer ${accessToken}`)
      .set('authentication', `Bearer ${idToken}`)
      .expect(200)
      .end((err, response) => {
        if (err) {
          return done(err);
        } else {
          const body = response.body;
          chai.expect(response.statusCode).to.be.equal(200);
          chai.expect(body.access_token).to.be.exist;
          done();
        }
      });
  });
})
