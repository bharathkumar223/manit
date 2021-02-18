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
app.use('/api', require('./src/users/users.controller'));
app.use('/school', require('./src/school/school.controller'));
app.use('/hobby', require('./src/hobby/hobby.controller'));
app.use('/document', require('./src/documentVerification/document.verification.controller'));
app.use('/user', require('./src/userVerification/user.verification.controller'));
app.use('/profile', require('./src/profile/profile.controller'));
app.use('/sticker', require('./src/sticker/sticker.controller'));
// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
