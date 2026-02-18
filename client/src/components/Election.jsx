import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { uiActions } from '../store/ui-slice'
import { voteActions } from '../store/vote-slice'
import { useSelector } from 'react-redux'

const Election = ({_id : id, title, description, thumbnail}) => {
  
  //open update modal

  const dispatch = useDispatch()

  const openUpdateModal = () => {
    dispatch(voteActions.changeIdOfElectionToUpdate(id))
    dispatch(uiActions.openUpdateElectionModal())
  }

  const isAdmin = useSelector(
  state => state.vote.currentVoter?.isAdmin === true
)


  return (
    <article className="election">
     <div className="election__image">
        <img src={thumbnail} alt={title} />
        </div>  
        <div className="elections__info">
            <Link to={`/elections/${id}`}> <h4>{title}</h4> </Link>
            <p>{description?.length > 255 ? description.substring(0,255) + "..." :
            description} </p>

            <div className="elections__cta">
                <Link to={`/elections/${id}`} className="btn sm"> Shiko </Link>
               {isAdmin && (
  <button className="btn sm primary" onClick={openUpdateModal}>
    Edito
  </button>
)}

            </div>
        </div>
    </article>
  )
}

export default Election