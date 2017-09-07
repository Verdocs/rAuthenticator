Under development, don't use

# Realster Okta Middleware
This module is a middleware for express to verify tokens with interospect of okta

## Usage
```javascript
import { RealsterOkta } from 'RealsterOkta';

const discoverUrl = 'disvoery url goes here';
const auth = new RealsterOkta(discoveryUrl);

express.use(auth.cookie);
```
