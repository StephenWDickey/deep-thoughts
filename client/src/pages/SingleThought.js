import React from 'react';

// import React Hook to pass in prop data
import { useParams } from 'react-router-dom';

// import useQuery hook and query
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';


// import ReactionList component
import ReactionList from '../components/ReactionList';


import Auth from '../utils/auth';


import ReactionForm from '../components/ReactionForm';

const SingleThought = props => {

  // create variable for data
  const { id: thoughtId } = useParams();

  // use our useQuery hook to import data
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });

  // either we have thought data or return
  // empty object while we wait for data
  const thought = data?.thought || {};


  // create JSX for if data is loading
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>
      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
    </div>
    
  );
};

export default SingleThought;
