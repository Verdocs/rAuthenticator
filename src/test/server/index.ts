import { rSecure as auth } from '../../';
import * as express from 'express';
import * as config from 'config';
import * as expreeCode from 'express-serve-static-core';

const app = express();

app.use(auth.header(config.get<string>('rSecure_Url')));

app.use('/', (req, res) => {
  let user = req['user'];
  res.status(200).send(user);
});

app.use(function (err, req, res, next) {
  res.status(err.code).send(err.error)
});

export { app };
