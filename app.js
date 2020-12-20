const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { checkToken } = require('./routes/middlewares');

/*base de datos*/
require('./dbConfig').createPool();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const conceptsRouter = require('./routes/concepts');
const postsRouter = require('./routes/posts');
const searchRouter = require('./routes/searchs');
const countriesRouter = require('./routes/countries');
const testsRouter = require('./routes/tests');
const mailsRouter = require('./routes/mails')


const app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/concepts', conceptsRouter);
app.use('/posts', postsRouter);
app.use('/search', searchRouter);
app.use('/countries', countriesRouter);
app.use('/tests', testsRouter);
app.use('/mails', mailsRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
