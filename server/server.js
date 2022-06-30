const express = require('express');


// import ApolloServer connection
const { ApolloServer } = require('apollo-server-express');


// import type definitions and resolvers
const { typeDefs, resolvers } = require('./schemas');



// import mongoose database connection here
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;


// create Apollo server and pass in schema
const server = new ApolloServer({
  typeDefs,
  resolvers
});


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// start the apollo server with schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
}

// make the Apollo server a piece of middleware
// that we can integrate into Express
server.applyMiddleware ({ app });


// invoke mongoose connection
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});



// invoke apollo server function
startApolloServer(typeDefs, resolvers);
