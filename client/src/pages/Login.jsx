import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { voteActions } from '../store/vote-slice';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setCredentials(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const loginVoter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/voters/login`,
        credentials
      );

      const newVoter = response.data;

      localStorage.setItem("currentUser", JSON.stringify(newVoter));
      dispatch(voteActions.changeCurrentVoter(newVoter));
      navigate("/results");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Diçka shkoi gabim. Provoni përsëri më vonë."
      );
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Hyr në elektorAL</h2>

        <form onSubmit={loginVoter}>
          {error && <p className="form__error-message">{error}</p>}

          <input
            type="text"
            name="email"
            placeholder="E-mail ose ID personale"
            onChange={changeInputHandler}
            autoFocus
          />

          <input
            type="password"
            name="password"
            placeholder="Fjalëkalimi"
            onChange={changeInputHandler}
          />

          <p className="form__forgot">
            <Link to="/forgot-password">Keni harruar fjalëkalimin?</Link>
          </p>

          <p>
            Nuk keni llogari? <Link to="/register">Regjistrohuni</Link>
          </p>

          <button type="submit" className="btn primary">Hyr</button>
        </form>
      </div>
    </section>
  );
};

export default Login;
