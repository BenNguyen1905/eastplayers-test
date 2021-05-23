const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // mocks: true,
    context: ({ req }) => ({ req }) 
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb connected!')
        const port = process.env.PORT || 5000;
        return server.listen(port)
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })