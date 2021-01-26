const _ = require('lodash');
const mongoose = require('mongoose');
const pathToImage = require('../Images/Image.utils')

module.exports = {
    initialLoad : function (schemaName, schema, collectionName)  {
    const model = mongoose.model(schemaName, schema, collectionName);
    // if there is not data in the collection, populate it
    model.countDocuments().then((count) => {
      if (count === 0) {
        // load prdefined data
        // which I prepare and named according to my collection name
        const data = require('../assets/mongoDefaultData');
        for(let school of data.documents) {
          if(school.logo === "ChoongangUniversity" || school.logo === "ChoongangDajinHighSchool"){
            var binImage = pathToImage(school.logo);
            school.logo = {
              data:binImage,
              contentType:'image/png'
            }
          }
        }
        console.log("data=> ",data.documents);
        model.insertMany(data.documents).then((results) => {
          _.map(results, (result) => { console.log(`Inserted _id:${result} into ${collectionName}`) });
        });
      }
    })
  }
}


