import React from 'react'
import { Link } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Congrats = () => {
  const token = useSelector(state => state?.vote?.currentVoter?.token)
  const navigate = useNavigate()


   //Access control
  
    useEffect(() => {
      if (!token) {
        navigate("/")
      }},[])
  
  return (
  
    <section className="congrats">
      <div className="container congrats__container">
        <FaCheckCircle className="congrats__icon" />
        <h2>Faleminderit për shprehjen e vullnetit tuaj të lirë!</h2>
        <p>Vota juaj u shtua tek kandidati që zgjodhët. Pas pak do të drejtoheni te faqja e rezultateve.</p>

        <Link to="/results" className="btn sm primary">Shiko rezultatet</Link>
      </div>
    </section>
  )
}

export default Congrats
