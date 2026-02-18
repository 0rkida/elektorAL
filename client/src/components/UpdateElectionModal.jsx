import React, { useEffect } from 'react'
import { AiOutlineClose } from "react-icons/ai"
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const UpdateElectionModal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null); 

    const dispatch = useDispatch()
    const idOfElectionToUpdate = useSelector(state => state?.vote?.idOfElectionToUpdate)
    const token = useSelector(state => state?.vote?.currentVoter?.token)
    const navigate = useNavigate()

    //close add election modal
    const closeModal = () => {
        dispatch(uiActions.closeUpdateElectionModal())
   }

   const fetchElection = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const election = response.data
    setTitle(election.title)
    setDescription(election.description)

  } catch (error) {
    console.log(error)
  }
}

useEffect(() => {
  if (idOfElectionToUpdate) {
    fetchElection()
  }
}, [idOfElectionToUpdate])

const updateElection = async (e) => {
    e.preventDefault()  
    try {
        const electionData = new FormData()
        electionData.set('title', title)
        electionData.set('description', description)
        if (thumbnail) {
            electionData.set('thumbnail', thumbnail)
        }
        const response = await axios.patch(
            `${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`,
            electionData,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }})
        closeModal()
        navigate(0)
    } catch (error) {
        console.log(error)  
    }
}


   
  return (
    <section className="modal">
        <div className="modal__content">
            <header className="modal__header">
                <h4>Perditeso zgjedhjet </h4>
                <button className="modal__close" onClick={closeModal}>
                    <AiOutlineClose />
                </button>
            </header>
            <form onSubmit={updateElection} >
                <div>
                    <h6>Titulli i zgjedhjve: </h6>
                    <input type="text" value={title} onChange= {e => setTitle(e.target.value)}  name ='title' />
                </div>

                 <div>
                    <h6>Pershkrimi: </h6>
                    <input type="text" value={description} onChange= {e => setDescription(e.target.value)} name='description'  />
                </div>

                 <div>
                    <h6>Imazhi: </h6>
                    <input type="file" placeholder="Thumbnail"  onChange= {e => setThumbnail(e.target.files[0])} name='thumbnail'
                    accept=".png,.jpg,.jpeg,.webp,.avif"/>
                </div>

                <button type="submit" className="btn primary">Perditeso zgjedhjen</button>


            </form>
        </div>
    </section>
  )
}

export default UpdateElectionModal