Under development, don't use

# Realster Okta Middleware
This module is a middleware for express to verify tokens with interospect of okta

## Usage
```javascript
import { RealsterOkta as auth } from 'rOkta';
import * as express from 'express';
import * as config from 'config';
import * as expreeCode from 'express-serve-static-core';
import * as cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

//rSecure as name of the cookie to look into
app.use(auth.cookie(config.get<string>('rSecure_Url'), 'rSecure'));

app.use('/', (req, res) => {
  //can get user from req['user]
  let user = req['user'];
  res.status(200).send(user);
});

//handle errors
app.use(function (err, req, res, next) {
  res.status(err.code).send(err.error)
});

```
