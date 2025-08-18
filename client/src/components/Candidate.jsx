import React from 'react'

const Candidate = ({ image ,id,  name, motto }) => {
  return (
    <article className="candidate">
    <div className="candidate__image">
        <img src={image} alt={name} />
    </div>

    <h5>{name?.length > 20 ? name.substring(0, 20) + "..." : name}</h5>
    <small>{motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}</small>
    <button className="btn primary"> Voto ! </button>
    </article>
  )
}

export default Candidate