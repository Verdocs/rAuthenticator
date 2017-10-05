Under development, don't use

# Realster rSecure Middleware
This module is a middleware for express to verify tokens with rSecure

## Usage
```javascript
import { rSecure as auth } from 'rAuthenticator';
import * as express from 'express';
import * as config from 'config';

const app = express();

app.use(auth.header(config.get<string>('rSecure_Url')));

app.use('/', (req, res) => {
  let user = req['user'];
  res.status(200).send(user);
});
```
