Under development, don't use

# Realster rSecure Middleware
This module is a middleware for express to verify tokens with rSecure

## Usage
```javascript
const app = express();
app.use(cookieParser());

app.use(auth.cookie(config.get<string>('rSecure_Url'), 'rSecure'));

app.use('/', (req, res) => {
  let user = req['user'];
  res.status(200).send(user);
});
```
