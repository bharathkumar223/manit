const mongoose = require('mongoose');
// mongoose.set('debug', true);
const Schema = mongoose.Schema;
const schema = new Schema({
    name: { type: String, unique: true, required: true },
    schoolType : { type: String},
    address : { type: String},
    logo:{
        data: {type:Buffer, required:true},
        contentType: {type:String , required:true}
    }
},{collection:'SchoolList'});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});


// const dummyDataOne = new SchoolSearch({ id:'identifier1',isConstant:true, name: 'Choongang University', address: 'Dummy address for Choongang University' });
// const dummyDataTwo = new SchoolSearch({ id:'identifier2',isConstant:true, name: 'Korea University', address: 'Dummy address for Choongang University' });
// const dummyDataThree = new SchoolSearch({ id:'identifier3',isConstant:true, name: 'Seoul National University', address: 'Dummy address for Choongang University' });
// const dummyDataFour = new SchoolSearch({ id:'identifier4',isConstant:true, name: 'Yonsei University', address: 'Dummy address for Choongang University' });
// const dummyDataFive = new SchoolSearch({ id:'identifier5',isConstant:true, name: 'Sogang University', address: 'Dummy address for Choongang University' });
// const dummyDataSix = new SchoolSearch({ id:'identifier6',isConstant:true, name: 'Naksang High School', address: 'Dummy address for Choongang University' });
// const dummyDataSeven = new SchoolSearch({ id:'identifier7',isConstant:true, name: 'Bundang High School', address: 'Dummy address for Choongang University' });
// const dummyDataEight = new SchoolSearch({ id:'identifier8',isConstant:true, name: 'Dolma High School', address: 'Dummy address for Choongang University' });
// const dummyDataNine = new SchoolSearch({ id:'identifier9',isConstant:true, name: 'Emae High School', address: 'Dummy address for Choongang University' });
// const dummyDataTen = new SchoolSearch({ id:'identifier10',isConstant:true, name: 'Sunae High School', address: 'Dummy address for Choongang University' });
// const dummyDataEleven = new SchoolSearch({ id:'identifier11',isConstant:true, name: 'Seohyun Middle School', address: 'Dummy address for Choongang University' });
// const dummyDataTwelve = new SchoolSearch({ id:'identifier12',isConstant:true, name: 'Cheongsol Middle School', address: 'Dummy address for Choongang University' });
// const dummyDataThirteen = new SchoolSearch({ id:'identifier13',isConstant:true, name: 'Yatab Middle School', address: 'Dummy address for Choongang University' });
// const dummyDataFourteen = new SchoolSearch({ id:'identifier14',isConstant:true, name: 'Bulgok Middle School', address: 'Dummy address for Choongang University' });
// const dummyDataFifteen = new SchoolSearch({ id:'identifier15',isConstant:true, name: 'Beckhyun Middle School', address: 'Dummy address for Choongang University' });

// SchoolSearch.create(dummyDataOne,
//               dummyDataTwo,
//               dummyDataThree,
//               dummyDataFour,
//               dummyDataFive,
//               dummyDataSix,
//               dummyDataSeven,
//               dummyDataEight,
//               dummyDataNine,
//               dummyDataTen,
//               dummyDataEleven,
//               dummyDataTwelve,
//               dummyDataThirteen,
//               dummyDataFourteen,
//               dummyDataFifteen, function(error) {
// //   assert.ifError(error);
// if(error){
//     console.log(error);
// }
// });

module.exports = mongoose.model('SchoolList', schema);
// module.exports = schema;
