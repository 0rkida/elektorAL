import React from 'react'
import { IoMdTrash } from "react-icons/io";


const ElectionCandidate = ({name, image, motto, id}) => {
  return (
    <li className="electionCandidate">
  <div className="electionCandidate__image">
    <img src={image} alt={name} />
    <button className="electionCandidate__btn">
      <IoMdTrash />
    </button>
  </div>
  <div className="electionCandidate__info">
    <h5>{name}</h5>
    <small>
      {motto?.length > 70 ? motto.substring(0, 70) + "..." : motto}
    </small>
  </div>
</li>

  )
}

export default ElectionCandidate