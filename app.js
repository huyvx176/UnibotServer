/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const engine = require('ejs-locals');
// const expresslayout = require('express-ejs-layouts');
const router = require('./router/router');
const jwt = require("jsonwebtoken");
const fs = require('fs');


const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

const app = express();

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

//check jwt 
app.use(function (req, res, next) {
  console.log(JSON.stringify(req.headers['x-access-token']))
  if (req.headers && req.headers['x-access-token']) {
    jwt.verify(req.headers['x-access-token'], fs.readFileSync('./key/myKey.pub'), function (err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      console.log(JSON.stringify(decode))
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
/**
 * Primary app routes.
 */
app.use(router);

app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));



/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
