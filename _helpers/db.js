const config = require('../config.json');
const mongoose = require('mongoose');
const schoolListSchema = require('../school/schoolList.model')
const mongoDefaultData = require('./mongoDefaultData')
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions,(err) => {
    mongoDefaultData.initialLoad('SchoolList','SchoolList','SchoolList')
});
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    School: require('../school/school.model'),
    SchoolList: require('../school/schoolList.model'),
    Image: require('../Images/Image.model')
};