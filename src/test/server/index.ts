import { RealsterOkta as auth } from '../../';
import * as express from 'express';
import * as config from 'config';
import * as expreeCode from 'express-serve-static-core';
import * as cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

const client = {
  discoverUrl: config.get<string>('url'),
  clientId: config.get<string>('clientId'),
  clientSecret: config.get<string>('clientSecret')
}

app.use(auth.cookie(client))

app.use('/', (req, res) => {
  // console.log(req.cookies);
  res.status(200).send({
    access_token: req['access_token'],
    id_token: req['id_token']
  });
});

export { app };
