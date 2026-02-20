import React from 'react'
import { candidates as dummyCandidates } from '../data'
import { useParams } from 'react-router-dom' 
import { useSelector } from 'react-redux'
import Candidate from '../components/Candidate'
import ConfirmVote from '../components/ConfirmVote'
import { useState, useEffect } from 'react'
import axios from 'axios' 
import { useNavigate } from 'react-router-dom'

const Candidates = () => {

  const navigate = useNavigate() 

  //Access control

  useEffect(() => {
    if (!token) {
      navigate("/")
    }},[])


  const {id: selectedElection} = useParams()
  const [candidates, setCandidates] = useState([])
  const [canVote, setCanVote] = useState(true)
  const token = useSelector(state => state?.vote?.currentVoter?.token)

  const voteCandidateModalShowing = useSelector (state => state.ui.voteCandidateModalShowing)
 

  const voterId = useSelector(state => state?.vote?.currentVoter?.id)
  const votedElections = useSelector(state => state?.vote?.currentVoter?.votedElections)

  const getCandidates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${selectedElection}/candidates`,
        {withCredentials: true, headers: {Authorization: `Bearer ${token}`}}) 
      setCandidates(response.data)

      } catch (error) {
        console.error(error)
      }

    }


  

  // if (votedElection.includes(selectedElection)) 
  //   {setCanVote(false);
  //   }

  //check if voter has already voted
  // const getVoter = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/voters/${voterId}`,
  //       {withCredentials: true, headers: {Authorization: `Bearer ${token}`}}) 
  //     const votedElections = await response.data.votedElections;
  //     if (votedElections.includes(selectedElection)) {
  //       setCanVote(false);
  //     }
  // }
  //   catch (error) {
  //     console.error(error)
  //   }
  // }

  useEffect(() => {
  if (votedElections.includes(selectedElection)) {
    setCanVote(false);
  } else {
    setCanVote(true);
  }
}, [votedElections, selectedElection]);


  useEffect(() => {
    getCandidates()
    // getVoter()

    // if (votedElections.includes(selectedElection)) {
    //     setCanVote(false);
    //   }
  }, [selectedElection])


  return (

    <>
    <section className="candidates">
      {!canVote ?  <header className="candidates__header"> 
      <h1>Ju keni votuar tashme </h1>
        <p>Ju lejoheni te votoni vetem nje here ne kete zgjedhje. Ju lutem votoni ne nje zgjedhje tjeter ose mbylleni procesin e votimit.</p>
      </header> : <> {candidates.length > 0 ? 
      <header className="candidates__header"> 
      <h1>Voto kandidatin tënd </h1>
        <p>Këta janë kandidatët për këto zgjedhje. Ju ftojmë të votoni një herë me qetësi dhe përgjegjësi, 
          duke siguruar që çdo votë të ketë vlerën e saj.</p>
      </header> : <header className="candidates__header"> 
      <h1>Zgjedhje Joaktive </h1>
        <p>Nuk u gjeten kandidate per kete zgjedhje, ju lutemi provojeni me vone.</p>
      </header>}
      <div className="container candidates__container">
        {
          candidates.map(candidate => <Candidate key = {candidate._id} {...candidate} />)
        }


      </div>
      </> }
    </section>
    {voteCandidateModalShowing && <ConfirmVote selectedElection={selectedElection}/>}
    </>
  )
}

export default Candidates