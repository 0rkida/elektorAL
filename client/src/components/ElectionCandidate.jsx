import React from 'react'
import { IoMdTrash } from "react-icons/io"
import axios from 'axios'
import { useSelector } from 'react-redux'

const ElectionCandidate = ({ fullName, image, motto, _id, party, municipality }) => {
  const token = useSelector(state => state.vote.currentVoter?.token)

  const deleteCandidate = async () => {
    console.log("DELETE CLICKED:", _id)

    if (!_id) return

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/candidates/${_id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      window.location.reload()
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error)
    }
  }

  return (
    <li className="electionCandidate">
      <div className="electionCandidate__image">
        <img src={image} alt={fullName} />
        <button
          type="button"
          className="electionCandidate__btn"
          onClick={deleteCandidate}
        >
          🗑
        </button>
      </div>

      <div className="electionCandidate__info">
  <h5>{fullName}</h5>

  <div>Partia: {party}</div>
  <div>Bashkia: {municipality?.name}</div>
  <div>{motto}</div>
</div>

    </li>
  )
}

export default ElectionCandidate