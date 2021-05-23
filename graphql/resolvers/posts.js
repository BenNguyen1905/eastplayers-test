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
        async createCard(_,{postId, body }, context){
            const { username } = checkAuth(context);
            if (body.trim()==='') {
                throw new UserInputError('Empty comment',{
                    errors: {
                        body: 'Card body must not be empty'
                    }
                })
            }
            const post = await Post.findById(postId);
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
        },
        async createPostReact(_,{postId, name }, context){
            const { username } = checkAuth(context);
            if (name.trim()==='') {
                throw new UserInputError('Empty comment',{
                    errors: {
                        body: 'React name must not be empty'
                    }
                })
            }
            const post = await Post.findById(postId);
            if (!!post) {
                post.reacts.unshift({
                    name,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        async updatePost(_, { postId, title, body }, context) {
            try {
                const user = await checkAuth(context);
                const post = await Post.findById(postId);
                const updatePost = new Post({
                    _id: post.id,
                    title,
                    body
                })
                await post.updateOne(updatePost);
                await post.save();
                const updatedPost = await Post.findById(post.id);
                return updatedPost;
            } catch (err) {
                throw new Error(err);
            }

        },
        async deleteCard(_, { postId, cardId }, context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if (!!post) {
                const cardIndex = post.cards.findIndex(c => c.id === cardId);
                if (post.cards[cardIndex].username === username) {
                    post.cards.splice(cardIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            }
        },
        async deleteReact(_, { postId, reactId }, context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if (!!post) {
                const reactIndex = post.reacts.findIndex(c => c.id === reactId);
                if (post.reacts[reactIndex].username === username) {
                    post.reacts.splice(reactIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            }
        },
    }
}