const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    title: String,
    username: String,
    createdAt: String,
    cards:[
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    reacts:[
        {
            username: String,
            createdAt: String
        }
    ],
    boardId:{
        type:Schema.Types.ObjectId,
        ref: 'boards'
    }
})

module.exports = model('Post', postSchema);