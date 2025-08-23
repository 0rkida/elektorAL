import React, { useState } from 'react'
import { AiOutlineClose } from "react-icons/ai"
import { useDispatch } from 'react-redux'
import { uiActions } from '../store/ui-slice'


const AddCandidateModal = () => {

    const[fullName, setFullName] = useState("")
    const[motto, setMotto] = useState("")
    const[image, setImage] = useState("")

    const dispatch = useDispatch()

    //close add election modal
    const closeAddCandidateModal = () => {
        dispatch(uiActions. closeAddCandidateModal())
   }
   

  return (
    <section className="modal">
        <div className="modal__content">
            <header className="modal__header">
                <h4>Shto kandidat</h4>
                <button className="modal__close" onClick={closeAddCandidateModal}>
                    <AiOutlineClose />
                </button>
            </header>
            <form>
                <div>
                    <h6>Emri i kandidatit:</h6>
                    <input type="text" value = {fullName} name='fullName' onChange={e => setFullName(e.target.value)} />
                </div>

                 <div>
                    <h6>Moto e kandidatit:</h6>
                    <input type="text" value = {motto} name='motto' onChange={e => setMotto(e.target.value)} />
                </div>

                 <div>
                    <h6>Foto e kandidatit:</h6>
                    <input type="file"  name='image' onChange={e => setImage(e.target.files[0])} accept='png, jpg, jpeg, webp, avif' /> 
                </div>

                <button type="submit" className="btn primary">
                    Shto kandidatin
                </button>

            </form>
        </div>
    </section>
  )
}

export default AddCandidateModal