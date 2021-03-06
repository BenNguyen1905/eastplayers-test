const { model, Schema } = require('mongoose');

const boardSchema = new Schema({
    title: String,
    username: String,
    createdAt: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = model('Board', boardSchema);