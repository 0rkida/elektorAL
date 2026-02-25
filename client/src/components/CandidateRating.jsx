import React from 'react'

const CandidateRating = ({ name, fullName, image, votes = 0, totalVotes }) => {
  const displayName = fullName || name || '';
  const percentage =
    votes > 0 && totalVotes > 0 ? ((votes / totalVotes) * 100) : 0;

  return (
    <li className="result__candidate">
        <div className="result__candidate-image">
            <img src={image} alt={displayName} /> 
        </div>

        <div className="result__candidate-info">
           <div>
             <h5>{displayName}</h5>
            <small>{`${votes} ${votes === 1 ? "vote" : "votes"}`}</small>
           </div>
           <div className="result__candidate-rating">
            <div className="result__candidate-loader">
                <span style={{width: `${percentage}%`}}></span>
             
            </div>

            <small>
                {`${percentage.toFixed(2)}%`}
            </small>
        </div>
        </div>

        
    </li>
  )
}

export default CandidateRating