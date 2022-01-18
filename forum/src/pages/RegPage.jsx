import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/regPage.css';
import ws from '../util/api';

const RegPage = ()=>{
  const navigate = useNavigate();
  const [form, setForm] = useState({
    login:'',password:''
  })



  const changeHandler = (event) =>{
    setForm({...form, [event.target.id]: event.target.value})
  }

  const registrationHandler = async (e)=>{
    e.preventDefault();
    try{
      ws.send(JSON.stringify({...form, type:'signup'}))
      navigate('/auth')
    } catch(e){
      console.log(e)
    }
  }

  return(
    <div className="d-flex justify-content-around">
      <form className="d-flex min-width flex-column justify-content-center align-items-center mt-2 w-25 border shadow">
        <div className="justify-content-center">
          <h2 className="d-flex">Регистрация</h2>
        </div>
        <div className="w-50">
          <label htmlFor="login" className="form-label">login:</label>
          <input type="text" className="form-control" id="login" placeholder="login" onChange={changeHandler}/>
        </div>
        <div className="w-50">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" className="form-control" id="password" placeholder="password" onChange={changeHandler}/>
        </div>
        <div className=" d-flex w-50 justify-content-end mb-2">
          <button className="btn btn-primary mt-2 " onClick={registrationHandler}>отправить</button>       
        </div>
      </form>
    </div>    
  )
}

export default RegPage;