import React from 'react'
import { IoMdTrash } from "react-icons/io";
import axios from 'axios';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const ElectionCandidate = ({name, image, motto, _id: id}) => {
  const navigate = useNavigate()

  const token = useSelector(state => state.vote.currentVoter?.token)

  const deleteCandidate = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/candidates/${id}`,
        {withCredentials: true}
      )

      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <li className="electionCandidate">
  <div className="electionCandidate__image">
    <img src={image} alt={name} />
    <button className="electionCandidate__btn" onClick={deleteCandidate}>
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