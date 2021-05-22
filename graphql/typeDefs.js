const { gql } = require('apollo-server');

module.exports = gql`
    type Board{
        id: ID!
        createdAt:String!
        username: String!
        title: String!
        posts:[Post]
    }
    type Post{
        id: ID!
        body: String!
        createdAt:String!
        username: String!
        title: String!
        boardId: ID!
        cards:[Card]
        reacts:[React]
    }
    type Card{
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type React{
        id: ID!
        createdAt: String!
        username: String!
        name: String!
    }
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query{
        getBoards: [Board]
        getBoard(boardId: ID!): Board
        getPosts: [Post]
        getPost(postId: ID!): Post
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createBoard(title: String!): Board!
        deleteBoard(boardId: ID!): String!
        createPost(boardId:ID!, title:String!, body: String!): Post!
        deletePost(postId: ID!): String!
        createCard(postId: String!, body: String!): Post!
        createPostReact(postId: ID!, name: String!): React!
    }
`