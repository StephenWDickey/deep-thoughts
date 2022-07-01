// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
// we define the data in our thoughts array
// then we create the query
// we can also pass in username as a parameter
// reactions are a nested array in Thought
// ! exclamation point means that data MUST exist
// we define the User type and the Thought type
const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Query {
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }    
`;

// export the typeDefs
module.exports = typeDefs;