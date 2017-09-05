import * as express from 'express';
import * as config from 'config';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Auth } from './lib/auth';

const env = config.get<string>('env');

const app = express();

const corsSetting = cors({
  origin: config.get<string>('cors.origin'),
  credentials: config.get<string>('cors.credentials')
});

app.use(corsSetting);

app.use(bodyParser.json());

app.use(Auth.middleWare);

app.use('/', (req, res) => {
  res.send({
    hello: 'From the other side'
  });
});

const port = config.get<string>('port')
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});
