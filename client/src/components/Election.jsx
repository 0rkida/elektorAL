import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { uiActions } from '../store/ui-slice'

const Election = ({id, title, description, thumbnail}) => {
  
  //open update modal

  const dispatch = useDispatch()

  const openUpdateModal = () => {
    dispatch(uiActions.openUpdateElectionModal())
  }

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
                <button className="btn sm primary" onClick={openUpdateModal}>
                    Edito
                </button>
            </div>
        </div>
    </article>
  )
}

export default Election