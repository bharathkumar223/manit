const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.set('debug', true);
const pathToImage = require('../src/Images/Image.utils')

module.exports = {
    initialLoad : function ()  {
    var model = mongoose.model('SchoolList','SchoolList','SchoolList');
    // if there is not data in the collection, populate it
    model.countDocuments().then((count) => {
      if (count === 0) {
        // load prdefined data
        // which I prepare and named according to my collection name
        const data = require('../assets/schools');
        for(let school of data.documents) {
          if(school.logo === "ChoongangUniversity" || school.logo === "ChoongangDajinHighSchool"){
            // school.id = school.logo
            var binImage = pathToImage(school.logo);
            school.logo = {
              data:binImage,
              contentType:'image/png'
            }
            
          }
        }
        console.log("data=> ",data.documents);
        model.insertMany(data.documents).then((results) => {
          _.map(results, (result) => { console.log(`Inserted _id:${result} into SchoolList`) });
        });
      }
    })


    var hobbyModel = mongoose.model('Hobby');
    // if there is not data in the collection, populate it
    hobbyModel.countDocuments().then((count) => {
      if (count === 0) {
        // load prdefined data
        // which I prepare and named according to my collection name
        const data = require('../assets/hobbies');
        // for(let hobby of data.documents) {
        //     var binImage = pathToImage(school.logo);
        //     school.logo = {
        //       data:binImage,
        //       contentType:'image/png'
        //     }
        // }
        // console.log("data=> ",data.documents);
        hobbyModel.insertMany(data.documents).then((results) => {
          _.map(results, (result) => { console.log(`Inserted _id:${result} into Hobby`) });
        });
      }
    })
  }

  
}


