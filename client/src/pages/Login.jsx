import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const changeInputHandler = (e) => {
    setCredentials(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", credentials);
    // këtu bën request në backend për login
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Hyr në elektorAL</h2>

        <form onSubmit={handleSubmit}>
          <p className="form__error-message">Any error from the backend.</p>

          {/* Email ose ID */}
          <input 
            type="text" 
            name="email" 
            placeholder="E-mail ose ID personale" 
            onChange={changeInputHandler} 
            autoComplete="true" 
          />

          {/* Password */}
          <input 
            type="password" 
            name="password" 
            placeholder="Fjalëkalimi" 
            onChange={changeInputHandler} 
            autoComplete="true" 
          />

          {/* Forgot password link */}
          <p className="form__forgot">
            <Link to="/forgot-password">Keni harruar fjalëkalimin?</Link>
          </p>

          {/* Redirect to register */}
          <p>
            Nuk keni llogari? <Link to="/register">Regjistrohuni</Link>
          </p>

          <button type="submit" className="btn primary">Hyr</button>
        </form>
      </div>
    </section>
  )
}

export default Login;
