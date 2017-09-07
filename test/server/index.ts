import { RealsterOkta } from 'rokta';
import * as express from 'express';
import * as expreeCode from 'express-serve-static-core';
import * as cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

const auth = new RealsterOkta('https://dev-545441-admin.oktapreview.com/oauth2/default/.well-known/openid-configuration');
app.use(auth.cookie)

app.use('/', (req, res) => {
  res.status(200).send({
    access_token: req['access_token'],
    id_token: req['id_token']
  });
});

export { app };
