import React, { useState, useEffect } from 'react'
import { AiOutlineClose } from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const AddCandidateModal = () => {
  const [fullName, setFullName] = useState("")
  const [motto, setMotto] = useState("")
  const [party, setParty] = useState("")
  const [image, setImage] = useState(null)

  const [counties, setCounties] = useState([])
  const [municipalities, setMunicipalities] = useState([])

  const [county, setCounty] = useState("")               
  const [municipality, setMunicipality] = useState("")   

  const dispatch = useDispatch()
  const token = useSelector(state => state?.vote?.currentVoter?.token)
  const { id: electionId } = useParams()

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/counties`)
      .then(res => setCounties(res.data))
      .catch(err => console.log(err))
  }, [])

  
 useEffect(() => {
  if (!county) {
    setMunicipalities([])
    return
  }

  axios.get(`${process.env.REACT_APP_API_URL}/municipalities`)
    .then(res => {
      const filtered = res.data.filter(
        m => String(m.county?._id) === String(county)
      )
      setMunicipalities(filtered)
    })
    .catch(err => console.log(err))
}, [county])


  const closeAddCandidateModal = () => {
    dispatch(uiActions.closeAddCandidateModal())
  }

  const addCandidate = async (e) => {
    e.preventDefault()

    if (!municipality || !party || !image) {
      alert("Ploteso te gjitha fushat")
      return
    }

    try {
      const candidateInfo = new FormData()
      candidateInfo.append("fullName", fullName)
      candidateInfo.append("motto", motto)
      candidateInfo.append("party", party)
      candidateInfo.append("municipality", municipality)
      candidateInfo.append("currentElection", electionId)
      candidateInfo.append("image", image)

      await axios.post(
        `${process.env.REACT_APP_API_URL}/candidates`,
        candidateInfo,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      closeAddCandidateModal()
    } catch (error) {
      console.log(error.response?.data || error)
    }
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

        <form onSubmit={addCandidate}>
          <div>
            <h6>Emri i kandidatit:</h6>
            <input value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>

          <div>
            <h6>Moto:</h6>
            <input value={motto} onChange={e => setMotto(e.target.value)} />
          </div>

          <div>
            <h6>Partia:</h6>
            <input value={party} onChange={e => setParty(e.target.value)} />
          </div>

          <div>
            <h6>Qarku:</h6>
            <select value={county} onChange={e => setCounty(e.target.value)}>
              <option value="">Zgjidh qarkun</option>
              {counties.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <h6>Bashkia:</h6>
            <select
              value={municipality}
              onChange={e => setMunicipality(e.target.value)}
              disabled={!county}
            >
              <option value="">Zgjidh bashkine</option>
              {municipalities.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <h6>Foto:</h6>
            <input type="file" onChange={e => setImage(e.target.files[0])} />
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
