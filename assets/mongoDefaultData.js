var mongoose = require('mongoose');
const pathToImage = require('../Images/Image.utils')

exports.documents = [
  {
    _id: mongoose.Types.ObjectId(),
    name:"Choongang University",
    address:"Dummy address for Choongang University",
    schoolType:"university",
    logo : "ChoongangUniversity"
  },
  {
    _id: mongoose.Types.ObjectId(),
    name:"Choongang Dajin High School",
    address:"Dummy address for Choongang Dajin High School",
    schoolType:"high",
    logo : "ChoongangDajinHighSchool"
  }
];