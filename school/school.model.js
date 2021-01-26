const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String },
    name: { type: String, required: true },
    schoolType : { type: String},
    enrollment: { type: String },
    department  : { type: String },
    yearOfEntrance  : { type: String },
    createdDate: { type: Date, default: Date.now },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('School', schema);

