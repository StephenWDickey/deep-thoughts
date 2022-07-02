import React from 'react';

// import ThoughtList component
import ThoughtList from '../components/ThoughtList';

// import packages and functions
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';


import Auth from '../utils/auth';

import FriendList from '../components/FriendList';

import ThoughtForm from '../components/ThoughtForm';


const Home = () => {

  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);


  // put our Auth method into a variable 
  const loggedIn = Auth.loggedIn();

  // now we get thoughts from data array
  // OPTIONAL CHAINING
  // negates the need to check if object exists before getting properties
  // if data exists, store in thoughts variable
  // if data DOESNT exist, return an empty array
  const thoughts = data?.thoughts || [];
  
  console.log(thoughts);
  
  // use useQuery for QUERY_ME_BASIC query
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (
          <div className = "col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
        { loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null }
      </div>
    </main>
  );
};

export default Home;
