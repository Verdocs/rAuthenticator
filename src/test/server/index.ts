import { RealsterOkta as auth, IClient } from '../../';
import * as express from 'express';
import * as config from 'config';
import * as expreeCode from 'express-serve-static-core';
import * as cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

const client: IClient = {
  discoverUrl: config.get<string>('url'),
  clientId: config.get<string>('clientId'),
  clientSecret: config.get<string>('clientSecret')
}

app.use(auth.cookie(client, ['id_token', 'access_token']));

app.use('/', (req, res) => {
  let result = req['verifiedCookies'];
  res.status(200).send(result);
});

export { app };
