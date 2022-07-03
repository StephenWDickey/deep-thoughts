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


// import react router functions for React pages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import function from @apollo/client
// so we can use token when querying GraphQL
import {setContext} from '@apollo/client/link/context';


import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


// we will establish connection to /graphql endpoint
const httpLink = createHttpLink({
  uri: 'https://lit-dawn-68931.herokuapp.com/'
});


// now we will create middleware function to retrieve token
// then it will combine with httpLink
// we use imported setContext function
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// instantiate Apollo Client instance
// we also create cache object
const client = new ApolloClient({
  // combine httpLink and authLink
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});



function App() {
  
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/signup"
                element={<Signup />}
              />
              <Route path="/profile">
                <Route path=":username" element={<Profile />} />
                <Route path="" element={<Profile />} />
              </Route>
              <Route
                path="/thought/:id"
                element={<SingleThought />}
              />
              <Route
                path="*"
                element={<NoMatch />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
