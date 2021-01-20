const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    schoolType : { type: String},
    enrollment: { type: String, required: true },
    grade: { type: String, required: true },
    department  : { type: String },
    studentId  : { type: String },
    class  : { type: String },
    createdDate: { type: Date, default: Date.now }
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

const SchoolSchema = schema;

module.exports = {School , SchoolSchema}