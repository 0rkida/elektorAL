import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/ui-slice';
import ScanIDModal from '../components/ScanIDmodal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



const Register = () => {
  const dispatch = useDispatch();
  const showModal = useSelector(state => state.ui.showScanIDModal);

  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    password: "",
    password2: "",
    idPersonal: "",
    datelindja: "",
    county: "",
    municipality: ""
  });

  const [counties, setCounties] = useState([]);
const [municipalities, setMunicipalities] = useState([]);

  // Funksioni që thirret nga modal-i pas OCR
  const handleScanID = (data) => {
    setUserData(prevState => ({
      ...prevState,
      emri: data.name || "",
      mbiemri: data.surname || "",
      idPersonal: data.personalID || "",
      datelindja: data.dob || "",
      county: "",
      municipality: ""
    }));
  };

  const changeInputHandler = (e) => {
    setUserData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.password2) {
      alert("Fjalëkalimet nuk përputhen!");
      return;
    }

    try {
      
      await axios.post (`${process.env.REACT_APP_API_URL}/voters/register`, userData)
      navigate('/');
      

            alert("Regjistrimi u krye me sukses!");
      setUserData({
        emri: "",
        mbiemri: "",
        email: "",
        password: "",
        password2: "",
        idPersonal: "",
        datelindja: "",
        county: "",
        municipality: ""
      });
    } catch (err) {
      setError(err.response.data.message || err.message);
    }
  };

  useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_URL}/counties`)
    .then(res => setCounties(res.data))
    .catch(console.error);
}, []);

useEffect(() => {
  if (!userData.county) {
    setMunicipalities([]);
    return;
  }

  axios.get(
    `${process.env.REACT_APP_API_URL}/municipalities/by-county/${userData.county}`
  )
    .then(res => setMunicipalities(res.data))
    .catch(console.error);

}, [userData.county]);


  return (
    <section className="register">
      <div className="container register__container">
        <h2>Regjistrohu</h2>

        <form onSubmit={handleSubmit}>
          {error && <p className="form__error-message">{error}</p> }

          {/* Buton për të skanuar ID */}
          <div>
            <button
              type="button"
              className="btn secondary"
              onClick={() => dispatch(uiActions.openScanIDModal())}
            >
              📷 Skanoni ID
            </button>

            {showModal && (
              <ScanIDModal
                onScan={handleScanID}
                onClose={() => dispatch(uiActions.closeScanIDModal())}
              />
            )}
          </div>

          {/* Emri & Mbiemri */}
          <div className="form__row">
            <input type="text" name="emri" placeholder="Emri" value={userData.emri} onChange={changeInputHandler}  />
            <input type="text" name="mbiemri" placeholder="Mbiemri" value={userData.mbiemri} onChange={changeInputHandler} />
          </div>

          {/* ID & Datëlindja */}
          <div className="form__row">
            <input type="text" name="idPersonal" placeholder="ID Personale" value={userData.idPersonal} onChange={changeInputHandler}  />
            <input type="date" name="datelindja" placeholder="Datëlindja" value={userData.datelindja} onChange={changeInputHandler}  />
          </div>

          {/* County & Municipality */}
          <div className="form__row">
  <label>
    Qarku
    <select
      value={userData.county}
      onChange={(e) =>
        setUserData(prev => ({
          ...prev,
          county: e.target.value,
          municipality: ""
        }))
      }
      required
    >
      <option value="">Zgjidh qarkun</option>
      {counties.map(c => (
        <option key={c._id} value={c._id}>{c.name}</option>
      ))}
    </select>
  </label>

  <label>
    Bashkia
    <select
      value={userData.municipality}
      disabled={!userData.county}
      onChange={(e) =>
        setUserData(prev => ({
          ...prev,
          municipality: e.target.value
        }))
      }
      required
    >
      <option value="">Zgjidh bashkinë</option>
      {municipalities.map(m => (
        <option key={m._id} value={m._id}>{m.name}</option>
      ))}
    </select>
  </label>
</div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={userData.email}
            onChange={changeInputHandler}
            autoComplete="true"
            required
          />

          {/* Password & Confirm */}
          <div className="form__row">
            <input
              type="password"
              name="password"
              placeholder="Fjalëkalimi"
              value={userData.password}
              onChange={changeInputHandler}
              autoComplete="true"
              required
            />
            <input
              type="password"
              name="password2"
              placeholder="Konfirmo Fjalëkalimin"
              value={userData.password2}
              onChange={changeInputHandler}
              autoComplete="true"
              required
            />
          </div>

          {/* Checkbox për terms */}
          <div className="form__checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms"> Pajtohem me Termat dhe Kushtet </label>
          </div>

          <p>
            E keni krijuar llogarinë tuaj? <Link to="/login">Logohu në elektorAL</Link>
          </p>

          <button type="submit" className="btn primary">Regjistrohu</button>
        </form>
      </div>
    </section>
  );
};

export default Register;
