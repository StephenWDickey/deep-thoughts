// import our models
const { User, Thought } = require ('../models');


// this is a feature of apollo that will notice if
// we do not have unique values, this will be useful
// for our login mutation
const { AuthenticationError } = require('apollo-server-express');


// import signToken function from utils/auth.js
const { signToken } = require('../utils/auth');



// create resolver for query
const resolvers = {
    Query: {
        // this function is for authorizing our tokens!
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                    // remember the minus means we are not
                    // returning these values
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends');

                return userData;
            }

            // add error handling
            throw new AuthenticationError('Not logged in');
        },
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
        },
        // get all users
        users: async () => {
        return User.find()
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
        return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
    },
    // we create a Mutation property
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            // we take user data and create token
            const token = signToken(user);
            return {token, user};
        },
        // login mutation takes email and password
        login: async (parent, {email, password}) => {
            // mongoose will find one user model and return the email
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            
            // sign token with user data
            const token = signToken(user);

            return {token, user};
        },

        addThought: async (parent, args, context) => {
            if (context.user) {

              // use of spread operator ... to not lose rest of
              // key value pair info in thought model
              // we just take the username value from JWT
              // and make that equal to the username property in Thought
              const thought = await Thought.create({ ...args, username: context.user.username });
          
              // we add the Thought made by the user
              // to the user model
              await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { thoughts: thought._id } },
                // remember new true will return the update User info
                // not the old user info
                { new: true }
              );
          
              return thought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
              const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $push: { reactions: { reactionBody, username: context.user.username } } },
                { new: true, runValidators: true }
              );
          
              return updatedThought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                // addToSet operator will prevent duplicates being added to array
                // while push operator does not care about value being unique
                { $addToSet: { friends: friendId } },
                { new: true }
              ).populate('friends');
          
              return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;