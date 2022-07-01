// import our models
const { User, Thought } = require ('../models');


// create resolver for query
const resolvers = {
    Query: {
        // parent is a placeholder parameter
        // then we access username 
        thoughts: async (parent, {username}) => {
            // ternary operator checks if username exists
            // if it does, we create an object called params
            // with a key of username
            const params = username ? {username} : {};
            // pass params object into find method
            return Thought.find(params).sort({createdAt: -1});
        },
        thought: async (parent, {_id}) => {
            return Thought.findOne({_id});
        }
    }
};

module.exports = resolvers;