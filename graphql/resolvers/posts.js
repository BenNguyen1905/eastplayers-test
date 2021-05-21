const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError, UserInputError } = require('apollo-server');
const Board = require('../../models/Board');

module.exports = {
    Query: {
        async getPosts () {
            try{
                const posts = await Post.find().sort({ createdAt: -1});
                return posts;
            } catch (err){
                throw new Error(err);
            }
        },
        async getPost (_, { postId }) {
            try{
                const post = await Post.findById(postId);
                if (!!post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        
        async createPost(_,{ boardId, title, body }, context){
            const user = checkAuth(context);
            const newPost = new Post ({
                title,
                body,
                boardId,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            try {
              const post = await Post.findById(postId);
              await post.delete();
              if (user.username === post.username) {
                await post.delete();
                return 'Post deleted successfully';
              } else {
                throw new AuthenticationError('Action not allowed');
              }
            } catch (err) {
              throw new Error(err);
            }
        },
        async createCard(_,{boardId, postId, body }, context){
            const { username } = checkAuth(context);
            if (body.trim()==='') {
                throw new UserInputError('Empty comment',{
                    errors: {
                        body: 'Card body must not be empty'
                    }
                })
            }
            const board = await Board.findById(boardId);
            const post = await board.posts.find(p => p.id === postId);
            if (!!post) {
                post.cards.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}