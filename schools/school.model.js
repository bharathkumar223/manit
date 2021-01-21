const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    schoolType : { type: String},
    address : { type: String},
    enrollment: { type: String },
    grade: { type: String },
    department  : { type: String },
    studentId  : { type: String },
    class  : { type: String },isConstant:true,
    createdDate: { type: Date, default: Date.now },
    isConstant:{type:Boolean, default:false}
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

const School = mongoose.model('School', schema);
module.exports = School;
