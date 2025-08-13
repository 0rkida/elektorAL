import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import error from '../assets/error.gif';

const ErrorPage = () => {
  const navigate = useNavigate();

  //redirect to previous page after 5 seconds
  useEffect(() => {
    setTimeout(() => {
      navigate(-1);
    }, 5000); 
  })

  return (
    <section className ="errorPage">
    <div className="errorContent">
      <img src={error} alt = "Page not found" />
      <h1>404</h1>
      <p>This page does not exist. You will be directed to the previous page shortly</p>
      </div>
      </section>
    
  )
}

export default ErrorPage