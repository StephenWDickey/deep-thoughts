

// const express = require('express');


// const path = require('path');

// // import ApolloServer connection
// const { ApolloServer } = require('apollo-server-express');


// // import type definitions and resolvers
// const { typeDefs, resolvers } = require('./schemas');


// // import auth middleware for JWT
// // pass it in as context for new server instance
// const { authMiddleware } = require('./utils/auth');


// // import mongoose database connection here
// const db = require('./config/connection');

// const PORT = process.env.PORT || 3001;


// // create Apollo server and pass in schema
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   // pass in context for HTTP header
//   // we use our middleware to authenticate 
//   // the token before our resolver gets it
//   context: authMiddleware
// });


// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());



// // start the apollo server with schema
// const startApolloServer = async (typeDefs, resolvers) => {
//   await server.start();
//   // make the Apollo server a piece of middleware
//   // that we can integrate into Express
//   server.applyMiddleware ({ app });
// };

// // invoke apollo server function
// startApolloServer(typeDefs, resolvers);


// //////////////////////////////////////////////////

// // these two expressions are important for production
// // serve up static assets
// // we check if the Node environment is in production
// // if so, we tell the app to use this path
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }
// // now we fetch the data from react's build directory
// // this is a wildcard GET request
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });


// ///////////////////////////////////////////////////


// // invoke mongoose connection
// db.once('open', () => {
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//   });
// });


////////////////////////////////////////////////////////////


const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const path = require('path');

const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');

//const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

//app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`:earth_africa: Now listening on localhost:${PORT}`));
// });

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };

  startApolloServer(typeDefs, resolvers);


