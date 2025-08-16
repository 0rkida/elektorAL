import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Register = () => {
const [userData, setUserData] = useState({emri:"", mbiemri:"", email:"", password:"", password2:""});

//function to change controlled inputs
const changeInputHandler = (e) => {
  setUserData(prevState => {
    return {...prevState, [e.target.name]: e.target.value}
  })
}

console.log(userData)

  return (
    <section className="register">
      <div className="container register__container">
        <h2> Regjistrohu </h2>

        <form> 
          <p className="form__error-message">
            Any error from the backend. 
          </p>
          <input type="text" name='emri' placeholder='Emri' onChange ={changeInputHandler} autoComplete='true' autoFocus/>
          <input type="text" name='mbiemri' placeholder='Mbiemri' onChange ={changeInputHandler} autoComplete='true'/>
          <input type="text" name='email' placeholder='E-mail' onChange ={changeInputHandler} autoComplete='true'/>
          <input type="password" name='password' placeholder='Fjalëkalimi' onChange ={changeInputHandler} autoComplete='true'/>
          <input type="password2" name='confirmPassword' placeholder='Konfirmo Fjalëkalimin' onChange ={changeInputHandler} autoComplete='true'/>
          <p>E keni krijuar llogarine tuaj ? <Link to = '/' > Logohu ne elektorAL </Link></p>
          <button type='submit'  className="btn primary"> Regjistrohu </button>

        </form>
      </div>
    </section>
  )
}

export default Register