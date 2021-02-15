const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String,  required: true },
    image:  {
        data: {type:Buffer},
        contentType: {type:String }
    },
    text: { type: String },
    dateOfPost: { type: Date, default: Date.now },
    likes:[{type: String}],
    commentCount: { type: Number ,default:0}
});

// schema.index({ requestBy: 1, requestTo: 1 , school:1}, { unique: true })

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // delete ret._id;
    }
});

module.exports = mongoose.model('Post', schema);