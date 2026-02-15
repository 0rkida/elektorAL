import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import { voteActions } from '../store/vote-slice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmVote = () => {
  const [modalCandidate, setModalCandidate] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const closeCandidateModal = () => {
    dispatch(uiActions.closeVoteCandidateModal())
  }

  const selectedVoteCandidate = useSelector(
    state => state.vote.selectedVoteCandidate
  )
  const token = useSelector(
    state => state?.vote?.currentVoter?.token
  )
  const currentVoter = useSelector(
    state => state?.vote?.currentVoter
  )

  const selectedElection = useSelector(
  state => state.vote.selectedElection
);





  const fetchCandidate = async () => {
    try {
      if (!selectedVoteCandidate) return

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setModalCandidate(response.data) // ✅ KRITIKE

    } catch (error) {
      console.error(error)
    }
  }

  const confirmVote = async () => {
  try {
    const electionId = modalCandidate.election;

    if (!electionId) {
      alert("Election mungon.");
      return;
    }

    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
      {
        selectedElection: electionId
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const voteResult = response.data;

    dispatch(
      voteActions.changeCurrentVoter({
        ...currentVoter,
        votedElections: voteResult
      })
    );

    navigate('/congrats');

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    fetchCandidate()
  }, [selectedVoteCandidate]) 
  if (!modalCandidate) {
    return null // ose loader
  }

  console.log("SENDING ELECTION:", selectedElection);


  return (
    <section className="modal">
      <div className="modal__content confirm__vote-content">
        <h5>Ju lutemi, konfirmoni votën tuaj!</h5>

        <div className="confirm__vote-image">
          <img
            src={modalCandidate.image}
            alt={modalCandidate.fullName}
          />
        </div>

        <h2>
          {modalCandidate.fullName.length > 17
            ? modalCandidate.fullName.substring(0, 17) + '...'
            : modalCandidate.fullName}
        </h2>

        <p>
          {modalCandidate.motto?.length > 30
            ? modalCandidate.motto.substring(0, 30) + '...'
            : modalCandidate.motto}
        </p>

        <div className="confirm__vote-cta">
          <button className="btn" onClick={closeCandidateModal}>
            Anullo
          </button>

          <button className="btn primary" onClick={confirmVote}>
            Konfirmo
          </button>
        </div>
      </div>
    </section>
  )
}

export default ConfirmVote
