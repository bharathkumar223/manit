const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    postId: { type: String,  required: true },
    commentedUser: { type: String ,  required: true},
    dateOfComment: { type: Date, default: Date.now },
    parentComment:{type: String},
});

// schema.index({ requestBy: 1, requestTo: 1 , school:1}, { unique: true })

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Comment', schema);