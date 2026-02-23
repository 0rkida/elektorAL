import React, { useEffect } from 'react'
import { voteActions } from '../store/vote-slice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const logout = async () => {
      try {
        // backend logout (fshin cookie)
        await axios.post(
          `${process.env.REACT_APP_API_URL}/voters/logout`,
          {},
          { withCredentials: true }
        )
      } catch (err) {
        console.log("Logout backend error:", err)
      } finally {
        // pastrimi i store dhe local/session storage
        dispatch(voteActions.changeCurrentVoter(null))
        localStorage.clear()
        sessionStorage.clear()

        // 3️⃣ redirect
        navigate("/login", { replace: true })
      }
    }

    logout()
  }, [dispatch, navigate])

  return null
}

export default Logout