var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema =  new Schema({
    name: {type:String , unique:true, required:true},
    data: {type:Buffer, required:true},
    contentType: {type:String , required:true}
});

ImageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});
 
//Image is a model which has a schema imageSchema
 
module.exports = mongoose.model('Image', ImageSchema);