const express = require('express'); // This returns a function
const app = express(); // This returns object of type Express
const courses = require('./routes/courses');
const home = require('./routes/home');
const logger = require('./logger'); // custom middleware
const debug = require('debug')('app:startup'); // set exports DEBUG=app:startup
const config = require('config');
const helmet = require('helmet'); // In this list there is a helmet middle functions. It helps you to secure your apps by setting various HTTP headers
const morgan = require('morgan'); // Another useful third-party middleware is morgen. We use Morgan to log HTTP request.

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(logger);
// When we call express.json() method this method return a piece of middleware and then we call app.use() to use that middleware in the request processing pipeline.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

if (app.get('env') === 'development') {
  // process.env.NODE_ENV === app.get('env') unlike  app.get('env') default process.env.NODE_ENV is undefined. app.get('env') default is development
  app.use(morgan('tiny'));
  debug('Morgan is enabled...'); // console.log()
}

// Configuration
debug(`Application name: ${config.get('name')}`);
debug(`Mail server name: ${config.get('mail.host')}`);
debug(`Mail server password: ${config.get('mail.password')}`); // set exports app_password= 'your password'

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
