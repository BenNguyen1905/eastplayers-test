const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const boardResolvers = require('./boards');

module.exports = {
    Board: {
        posts: boardResolvers.getPostsByBoard
    },
    Query:{
        ...postsResolvers.Query,
        ...boardResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...boardResolvers.Mutation
    }
}