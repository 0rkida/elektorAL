import React, { useEffect, useState } from 'react'
//import {elections as dummyElections} from '../data'
import ResultElection from '../components/ResultElection'
import axios from 'axios'
import { useSelector } from 'react-redux'


const Results = () => {
  const [elections, setElections] = useState([])
  const token = useSelector(state => state?.vote?.currentVoter?.token);

  const getElections = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections`, {withCredentials: true, headers: 
        {Authorization: `Bearer ${token}`}});
        const elections = await response.data;
        setElections(elections);

      } catch (err) {
        console.log(err);
      }
    }

    useEffect(() => {
      getElections();
    }, [])

  return (
    <section className="results">
      <div className="container results__container">
        {
      elections.map(election => <ResultElection key={election._id} {...election} />)
        }
      </div>
    </section>
  )
}


export default Results;