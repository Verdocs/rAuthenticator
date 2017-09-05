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

app.use('/', async (req, res) => {
  try {
    const provider = await Auth.getProvider(config.get<string>('okta.discover'));
    const authorizationHeader = req.header('Authorization');
    const token = authorizationHeader.split(' ')[1];
    const result = await provider.verify(token);
    res.send(JSON.parse(result));
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

const port = config.get<string>('port')
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});
