var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cardRoutes = express.Router();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Card = require('./models/card.model');
var ObjectId = require('mongodb').ObjectID;
var app = express();

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/nattapol";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

mongoose.connect('mongodb://127.0.0.1:27017/nattapol', { useNewUrlParser: true });
const connection = mongoose.connection;connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/card', cardRoutes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//getall cards
cardRoutes.route('/').get(function(req, res) {
  Card.find(function(err, todos) {
      if (err) {
          console.log(err);
      } else {
          res.json(todos);
      }
  });
});
//create card
cardRoutes.route('/:user/add').post(function(req, res) {
  let card = new Card(req.body);
  card.author = req.params.user;
  card.save()
      .then(todo => {
          res.status(200).json({'card': 'card added successfully'});
      })
      .catch(err => {
          res.status(400).send('adding new card failed');
      });
});
//edit card
cardRoutes.route('/edit').post(function(req, res) {
  console.log(req.body)
  Card.findOneAndUpdate({id:req.body.id,author:req.body.author},req.body,function(err, card){
    if (err) {
      return  res.status(400).send('editing card failed');
    }else{
      return res.status(200).json({'card': 'edit success'});
    }
    });
  });
  //delete card
  cardRoutes.route('/delete').post(function(req, res) {
    console.log(req.body)
    Card.deleteOne({id:req.body.id,author:req.body.author},function(err, card){
      if (err) {
        return  res.status(400).send('delete card failed');
      }else{
        return res.status(200).json({'card': 'delete success'});
      }
      });
    });

module.exports = app;
