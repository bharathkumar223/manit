require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
// app.use(jwt());

// api routes

// app.use('/api/school', require('./schools/school.controller'));
app.use('/api', require('./users/users.controller'));
app.use('/school', require('./school/school.controller'));
app.use('/hobby', require('./hobby/hobby.controller'));
app.use('/document', require('./documentVerification/document.verification.controller'));
app.use('/user', require('./userVerification/user.verification.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
