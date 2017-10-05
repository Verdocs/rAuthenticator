Under development, don't use

# Realster rSecure Middleware
This module is a middleware for express to verify tokens with rSecure

## Usage
```javascript
import { RealsterOkta as auth } from 'rOkta';
import * as express from 'express';
import * as config from 'config';
import * as expreeCode from 'express-serve-static-core';
import * as cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

app.use(auth.cookie(config.get<string>('rSecure_Url')));

app.use('/', (req, res) => {
  let user = req['user'];
  res.status(200).send(user);
});
```
