// import package
const jwt = require('jsonwebtoken');

// the secret enables the server to verify if
// it recoqnizes the token
// secret should be stored in .env file because
// if it is discovered, a new one must be created
// this will invalidate all current tokens
const secret = 'mysecretsshhhhh';
// we can give token an expiration
const expiration = '2h';

module.exports = {

    // pass in user data
  signToken: function({ username, email, _id }) {
    // capture user data in variable
    const payload = { username, email, _id };
    // take the user data and create tokenized string
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // we create authorization middleware
  // so it can be passed into resolver function
  authMiddleware: function({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token
        // split based on space between type and token
        .split(' ')
        .pop()
        .trim();
    }
  
    // if no token, return request object as is
    if (!token) {
      return req;
    }
  


    // we put jwt.verify() method in try/catch statement
    // this is so users with invalid tokens
    // can still see thought data
    try {
      // decode and attach user data to request object
      // notice we pass in secret as well
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } 
    
    catch {
      console.log('Invalid token');
    }
  
    // return updated request object
    return req;
  }
};