const app = require('express')();
const express = require('express');
const path = require('path');
const http = require('http').Server(app);
const enumm = require('./src/utils/enum.utils');
const config = require('./src/config/config');
// import Router file
const PageRouter = require('./src/routes/routes');

const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const i18n = require("i18n-express");

app.use(session({
  key: config.appConfig.SECRET_KEY,
  secret: config.appConfig.SECRET_JWT,
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   // secure: true,
  //   expires: new Date(Date.now() + (3600*1000)),
  //   // maxAge : config.appConfig.SessionTimeOut
  // }
}));

app.use(flash());
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["es", "en", "de", "ru", "it", "fr", "ind"],
  textsVarName: 'translation'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '10mb'}));
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use('/public', express.static('public'));
app.get('/layouts/', function(req, res) {
    res.render('view');
});

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Define All Route 
PageRouter(app);

const port = Number(process.env.PORT || 2222);
http.listen(port, function () {
  console.log(`Server running on port ${port} !`);
});

//------------------- database
const db = require("./src/models/model");

// db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Database with { force: true }');
//     initial();
// });

function initial() {
  db.role.create({
      name: "SuperUser",
      code: enumm.role.SuperUser
  });

  db.role.create({
      name: "Admin",
      code: enumm.role.Admin
  });

  db.role.create({
      name: "Employee",
      code: enumm.role.Employee
  });

  db.role.create({
    name: "Supplier",
    code: enumm.role.Supplier
  });

  db.role.create({
    name: "Manager",
    code: enumm.role.Manager
  });

  db.detailsInfo.create({
    name: 'Md. Asiqur Rahman Khan',
    contactNo: '01799089893',
    email: 'admin@email.com',
    address: "Dhaka, Bangladesh",
    roleId: enumm.role.SuperUser,
    employeeCode:Date.now()%1000000000
});

  db.user.create({
      username: 'Asiq',
      password: '$2a$08$oDOBw2EEQ6UbtLLe0TuDguGez0rY4xJNt5KbMoVY659Kd4E3poZTi',
      email: 'admin@email.com',
      roleId: enumm.role.SuperUser,
      detailsInfoId:1,
      forceChangePassword:true,
      status: true
  });

  db.attendanceType.create({
    name: "Clock IN",
    code: enumm.attendanceType.In
  });
  db.attendanceType.create({
    name: "Break Start",
    code: enumm.attendanceType.BreakStart
  });
  db.attendanceType.create({
    name: "Break End",
    code: enumm.attendanceType.BreakEnd
  });
  db.attendanceType.create({
    name: "Clock OUT",
    code: enumm.attendanceType.Out
  });

  db.paymentType.create({
    name: "Cash",
    code: enumm.paymentType.Cash
  });
  db.paymentType.create({
    name: "Cheque",
    code: enumm.paymentType.Cheque
  });
  db.paymentType.create({
    name: "Bank Transfer",
    code: enumm.paymentType.BankTransfer
  });
}