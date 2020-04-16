var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// const express = require('express');
const bodyParser = require("body-parser");

// const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/snowlockArt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});


// Create a scheme for art pieces
const artPieceSchema = new mongoose.Schema({
  name: String,
  date: String,
  descript: String,
  price: String,
  path: String,
  order: Number,
});

// Create a scheme for admin accounts
const adminAccountSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a scheme for commissions
const commissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  priceRange: String,
  descript: String,
  started: { type: Boolean, default: false },
  dateReceived: { type: Date, default: Date.now },
});


// Create a model for art pieces
const ArtPiece = mongoose.model('ArtPiece', artPieceSchema);
// Create a model for admin accounts
const AdminAccount = mongoose.model('AdminAccount', adminAccountSchema);
// Create a model for commissions
const Commission = mongoose.model('Commission', commissionSchema);


///////////////////////////////////////////////// ART PIECES


// Get a list of all the art pieces
app.get('/api/artPieces', async (req, res) => {
  console.log("in api/artPieces get");
  try {
    let artPieces = await ArtPiece.find();
    res.send(artPieces);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  console.log("in api/artPieces upload photo")
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new post: takes a name and a path to an image.
app.post('/api/artPieces', async (req, res) => {
  const art = new ArtPiece({
    name: req.body.name,
    date: req.body.date,
    descript: req.body.descript,
    price: req.body.price,
    order: req.body.order,
    path: req.body.path,
  });
  try {
    console.log("in api/artPieces post");
    await art.save();
    res.send(art);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get an art piace with a given id from the database
app.get('/api/artPieces/:id', async (req, res) => {
  console.log("in get of editId")
  try {
    console.log("in try of editId")
    let artPiece = await ArtPiece.findOne({ _id: req.params.id })
    res.send(artPiece);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Update an art piece in the database
app.put('/api/artPieces', async (req, res) => {
  console.log("in put of update")
  try {
    console.log("in try of update")
    let artPiece = await ArtPiece.findOne({ _id: req.body.id })
    artPiece.name = req.body.name;
    artPiece.date = req.body.date;
    artPiece.descript = req.body.descript;
    artPiece.price = req.body.price;
    artPiece.order = req.body.order;
    artPiece.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an art piece from the database
app.delete('/api/artPieces/:id', async (req, res) => {
  console.log("in delete");
  try {
    console.log("in try of delete")
    await ArtPiece.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


///////////////////////////////////////////////// ADMIN ACCOUNTS


// Get a list of all the admin accounts
app.get('/api/adminAccounts', async (req, res) => {
  console.log("in api/adminAccounts get");
  try {
    let adminAccounts = await AdminAccount.find();
    res.send(adminAccounts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get an admin account with a given username from the database
app.get('/api/adminAccounts/:username', async (req, res) => {
  console.log("in get of username search");
  try {
    let adminAccounts = await AdminAccount.findOne({ username: req.params.username });
    res.send(adminAccounts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a new admin account
app.post('/api/adminAccounts', async (req, res) => {
  console.log("in api/adminAccounts post");
  const admin = new AdminAccount({
    username: req.body.username,
    password: req.body.password,
  });
  try {
    await admin.save();
    res.send(admin);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Update an admin account in the database
app.put('/api/adminAccounts/:id', async (req, res) => {
  console.log("in put of admin update")
  try {
    let admin = await AdminAccount.findOne({ _id: req.params.id })
    admin.password = req.body.password;
    admin.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an admin account from the database
app.delete('/api/adminAccounts/:id', async (req, res) => {
  console.log("in admin delete");
  try {
    await AdminAccount.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


///////////////////////////////////////////////// COMMISSIONS

// Get a list of all the commissions
app.get('/api/commission', async (req, res) => {
  console.log("in api/commission get");
  try {
    let commissions = await Commission.find();
    res.send(commissions);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get  commissions
app.get('/api/commission', async (req, res) => {
  console.log("in api/commission get");
  try {
    let commissions = await Commission.find();
    res.send(commissions);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a commission with a given id from the database
app.get('/api/commission/:id', async (req, res) => {
  console.log("in get of commission search");
  try {
    let commissions = await Commission.findOne({ _id: req.params.id });
    res.send(commissions);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a new commission
app.post('/api/commission', async (req, res) => {
  console.log("in api/commission post");
  const commission = new Commission({
    name: req.body.name,
    email: req.body.email,
    priceRange: req.body.priceRange,
    descript: req.body.descript,
  });
  try {
    await commission.save();
    res.send(commission);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Update an admin account in the database
app.put('/api/commission', async (req, res) => {
  console.log("in put of commission update")
  try {
    let commission = await Commission.findOne({ _id: req.body.id })
    commission.started = req.body.started;
    commission.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete a commission from the database
app.delete('/api/commission/:id', async (req, res) => {
  console.log("in commission delete");
  try {
    await Commission.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


module.exports = app;

// curl -X POST -d '{"name":"test"}' -H "Content-Type: application/json" localhost:4201/api/artPieces
// curl -X GET localhost:4201/api/artPieces
// curl -X DELETE localhost:4201/api/artPieces/'5e0ba4b04ffa9a72844c20ca'

// curl -X POST -d '{"username":"test", "password":"1234"}' -H "Content-Type: application/json" localhost:4201/api/adminAccounts
// curl -X GET localhost:4201/api/adminAccounts
// curl -X GET localhost:4201/api/adminAccounts/'test'
// curl -X PUT -d '{"password":"inferno88"}' -H "Content-Type: application/json" localhost:4201/api/adminAccounts/'5e505a7b4e38c309a2b1aebf'
// curl -X DELETE localhost:4201/api/adminAccounts/'5e505a7b4e38c309a2b1aebf'

// curl -X GET localhost:4201/api/commission
// curl -X GET localhost:4201/api/commission/'5e508d74f2ee0e2282b77dbc'
// curl -X DELETE localhost:4201/api/commission/'5e508cb6f2ee0e2282b77dbb'
