Under development, don't use

# Realster Okta Middleware
This module is a middleware for express to verify tokens with interospect of okta

## Usage
```javascript
const app = express();
app.use(cookieParser());

const client: IClient = {
  discoverUrl: 'oAuth disvoery url goes here',
  clientId: 'clientId for using in interospect call',
  clientSecret: 'clientSecret for using in interospect call'
}

app.use(auth.cookie(client, ['id_token', 'access_token']));
```
