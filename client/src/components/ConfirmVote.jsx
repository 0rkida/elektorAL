import React, { useEffect, useState } from 'react'
import { candidates } from '../data'


const ConfirmVote = () => {
    const [modalCandidate, setModalCandidate] = useState({});

    //get the selected candidate

    const fetchCandidate = () => {
        candidates.find(candidate => {
            if (candidate.id === "c1"){
                setModalCandidate(candidate);
            }
        })
    }

    useEffect(() => {
        fetchCandidate();
    }, []);

  return (
            <section className="modal"> 
            <div className="modal__content confirm__vote-content">
                <h5>Ju lutemi , konfirmoni voten tuaj !</h5>
                <div className="conifrm__vote-image">
                    <img src={modalCandidate.image} alt={modalCandidate.name} />
                </div>
                <h2>{modalCandidate.name?.length > 17 ? modalCandidate.name?.substring(0, 17) + "..." : 
                    modalCandidate?.name}</h2>
                <p>{modalCandidate.motto?.length > 30 ? modalCandidate.motto?.substring(0, 30) + "..." : 
                    modalCandidate?.motto}</p>

                <div className="confirm__vote-cta">
                    <button className="btn">
                        Anullo
                    </button>

                    <button className="btn primary">
                        Konfirmo
                    </button>
                </div>

            </div>
            </section>

  )
}

export default ConfirmVote