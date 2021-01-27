const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String,  required: true },
    school: { type: String , required: true},
    status:{ type:String , default:'Pending'},
    createdDate: { type: Date, default: Date.now }
});

// schema.index({ requestBy: 1, requestTo: 1 , school:1}, { unique: true })

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('DocumentVerification', schema);