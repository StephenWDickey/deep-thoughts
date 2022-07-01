import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';


// import packages and functions
// Apollo Provider is a React component we can pass data through
// ApolloClient is a constructor function, will make connection to graphQL server
// InMemoryCache allows ApolloClient to cache API response data
// createHttpLink will act as middleware for network requests
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';



// we will establish connection to /graphql endpoint
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql'
});

// instantiate Apollo Client instance
// we also create cache object
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});



function App() {
  
    return (
      <ApolloProvider client={client}>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Home />
          </div>
          <Footer />
        </div>
      </ApolloProvider>
    );
}

export default App;
