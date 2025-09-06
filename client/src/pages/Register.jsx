import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/ui-slice';
import ScanIDModal from '../components/ScanIDmodal';

const Register = () => {

    const dispatch = useDispatch();
    const showModal = useSelector(state => state.ui.showScanIDModal);

  const [userData, setUserData] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    password: "",
    password2: "",
    idPersonal: "",
    datelindja: "",
    qarku: "",
    qyteti: ""
  });

  const changeInputHandler = (e) => {
    setUserData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleScanID = () => {
    setUserData(prevState => ({
      ...prevState,
      emri: "Arbër",
      mbiemri: "Hoxha",
      idPersonal: "J12345678",
      datelindja: "1999-05-20",
      qarku: "Tiranë",
      qyteti: "Tiranë"
    }));
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Regjistrohu</h2>

        <form>
          <p className="form__error-message">Any error from the backend.</p>

          {/* Buton për të skanuar ID */}
           <div>
      <button className="btn secondary" onClick={() => dispatch(uiActions.openScanIDModal())}>
        📷 Skanoni ID
      </button>

      {showModal && <ScanIDModal onScan={handleScanID} onClose={() => dispatch(uiActions.closeScanIDModal())} />}
    </div>

          {/* Emri & Mbiemri */}
          <div className="form__row">
            <input type="text" name="emri" placeholder="Emri" value={userData.emri} readOnly />
            <input type="text" name="mbiemri" placeholder="Mbiemri" value={userData.mbiemri} readOnly />
          </div>

          {/* ID & Datëlindja */}
          <div className="form__row">
            <input type="text" name="idPersonal" placeholder="ID Personale" value={userData.idPersonal} readOnly />
            <input type="date" name="datelindja" placeholder="Datëlindja" value={userData.datelindja} readOnly />
          </div>

          {/* Qarku & Qyteti */}
          <div className="form__row">
            <input type="text" name="qarku" placeholder="Qarku" value={userData.qarku} readOnly />
            <input type="text" name="qyteti" placeholder="Qyteti" value={userData.qyteti} readOnly />
          </div>

          {/* Email */}
          <input type="email" name="email" placeholder="E-mail" onChange={changeInputHandler} autoComplete="true" />

          {/* Password & Confirm */}
          <div className="form__row">
            <input type="password" name="password" placeholder="Fjalëkalimi" onChange={changeInputHandler} autoComplete="true" />
            <input type="password" name="password2" placeholder="Konfirmo Fjalëkalimin" onChange={changeInputHandler} autoComplete="true" />
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
  )
}

export default Register;
