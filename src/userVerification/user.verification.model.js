const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    requestBy: { type: String,  required: true ,unique:false},
    requestTo: { type: String , required: true ,unique:false},
    status:{ type:String , default:'Pending' },
    school:{ type: String , required:true,unique:false},
});

schema.index({ requestBy: 1, requestTo: 1 , school:1}, { unique: true })

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('UserVerification', schema);