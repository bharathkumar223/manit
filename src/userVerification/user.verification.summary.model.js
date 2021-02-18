const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    verificationStatus: { type: String,  required: true },
    requests: { type: Number,  required: true },
    pending: { type: Number,  required: true },
    approve: { type: Number,  required: true },
    decline: { type: Number,  required: true },
    pass: { type: Number,  required: true }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('UserVerificationSummary', schema);