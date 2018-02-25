import bodyParser from 'body-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import NestedError from 'nested-error-stacks';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import view from 'view';
// import streamer from 'streamer';
import routes from './routes';

const app = express();
const debug = Debug('test:app');
app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// view engine
app.use(view);

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err)
});

export default app;
