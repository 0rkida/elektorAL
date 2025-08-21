import React from 'react'
import { useDispatch } from 'react-redux'
import { uiActions } from '../store/ui-slice'

const Candidate = ({ image ,id,  name, motto }) => {

  const dispatch = useDispatch();

    //open confirm vote modal
    const openCandidateModal = () => {
        dispatch(uiActions.openVoteCandidateModal(id))
    }

  return (
    <article className="candidate">
    <div className="candidate__image">
        <img src={image} alt={name} />
    </div>

    <h5>{name?.length > 20 ? name.substring(0, 20) + "..." : name}</h5>
    <small>{motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}</small>
    <button className="btn primary" onClick={openCandidateModal}> Voto ! </button>
    </article>
  )
}

export default Candidate