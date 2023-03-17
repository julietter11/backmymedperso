require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var stocksRouter = require('./routes/stocks');
var pharmaciesRouter = require('./routes/pharmacies');
var medicamentsRouter = require('./routes/medicaments');
var booksRouter = require('./routes/books');

var app = express();

const fileUpload = require('express-fileupload');
app.use(fileUpload());
const cors = require('cors');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stocks', stocksRouter);
app.use('/pharmacies', pharmaciesRouter);
app.use('/medicaments', medicamentsRouter);
app.use('/books', booksRouter);

module.exports = app;
