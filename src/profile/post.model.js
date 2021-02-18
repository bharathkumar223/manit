const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String,  required: true },
    userName: { type: String,  required: true },
    image:  {
        data: {type:Buffer},
        contentType: {type:String }
    },
    text: { type: String },
    isLiked:{type:Boolean,default:false},
    likes:[{type: String}],
    commentCount: { type: Number ,default:0},
    createdDate: { type: Date, default: Date.now }
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