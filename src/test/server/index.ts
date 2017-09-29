import { rSecure as auth } from '../../';
import * as express from 'express';
import * as config from 'config';
import * as expreeCode from 'express-serve-static-core';
import * as cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

app.use(auth.cookie(config.get<string>('rSecure_Url'), 'rSecure'));

app.use('/', (req, res) => {
  let user = req['user'];
  res.status(200).send(user);
});

app.use(function (err, req, res, next) {
  res.status(err.code).send(err.error)
})

export { app };
