import React, { useEffect } from 'react'
import { voteActions } from '../store/vote-slice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Logout = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(voteActions.changeCurrentVoter(null))
    localStorage.removeItem("currentVoter")
    navigate("/")
  },[])



  return (
    <></>
  )
}

export default Logout