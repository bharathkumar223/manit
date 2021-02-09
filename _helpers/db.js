const config = require('../config.json');
const mongoose = require('mongoose');
const mongoDefaultData = require('./school')
const connectionURL = "mongodb+srv://manito:manito@cluster0.jvjvu.mongodb.net/manito?retryWrites=true&w=majority"
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
},(err) => {
         mongoDefaultData.initialLoad()
     })

// const connectionOptions = {
//          useNewUrlParser: true,
//          useCreateIndex: true,
//          useFindAndModify: true,
//          useUnifiedTopology: true
//      }

// mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions,(err) => {
//     mongoDefaultData.initialLoad()
// });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../src/users/user.model'),
    School: require('../src/school/school.model'),
    SchoolList: require('../src/school/schoolList.model'),
    Image: require('../src/Images/Image.model'),
    UserVerification: require('../src/userVerification/user.verification.model'),
    DocumentVerification: require('../src/documentVerification/document.verification.model'),
    Hobby: require('../src/hobby/hobby.model'),
    Post:require('../src/profile/post.model')
};