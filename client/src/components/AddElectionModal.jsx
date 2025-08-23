import React from 'react'
import { AiOutlineClose } from "react-icons/ai"
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { uiActions } from '../store/ui-slice'


const AddElectionModal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null); 

    const dispatch = useDispatch()

    //close add election modal
    const closeModal = () => {
        dispatch(uiActions.closeElectionModal())
   }
   
  return (
    <section className="modal">
        <div className="modal__content">
            <header className="modal__header">
                <h4>Krijo nje zgjedhje te re</h4>
                <button className="modal__close" onClick={closeModal}>
                    <AiOutlineClose />
                </button>
            </header>
            <form >
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
                    accept='png, jpg, jpeg, webp, avif'/>
                </div>

                <button type="submit" className="btn primary">Shto zgjedhje</button>


            </form>
        </div>
    </section>
  )
}

export default AddElectionModal