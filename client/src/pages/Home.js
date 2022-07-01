import React from 'react';

// import ThoughtList component
import ThoughtList from '../components/ThoughtList';

// import packages and functions
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';

const Home = () => {

  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // now we get thoughts from data array
  // OPTIONAL CHAINING
  // negates the need to check if object exists before getting properties
  // if data exists, store in thoughts variable
  // if data DOESNT exist, return an empty array
  const thoughts = data?.thoughts || [];
  console.log(thoughts);
  
  
  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
