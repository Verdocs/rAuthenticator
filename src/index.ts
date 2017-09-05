import * as express from 'express';
import * as config from 'config';
import * as bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.use('/', (req, res) => {
  res.send('hello');
});

const port = config.get<string>('port')
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});
