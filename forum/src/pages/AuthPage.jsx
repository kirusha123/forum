import React, {useState, useContext, useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ws from '../util/api'


const AuthPage = ()=>{
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    const messageHandler = (event)=>{
      const data = JSON.parse(event.data)
      console.log(data)
      if (data.type == 'signin'){
        auth.login(data.login, null)
        navigate('/forum')
      }
    }
    ws.addEventListener('message', messageHandler)
    return ()=>{ws.removeEventListener('message', messageHandler)}
  }, [])

  const [form, setForm] = useState({
    login:'',password:''
  })

  const changeHandler = (event) =>{
    setForm({...form, [event.target.id]: event.target.value})
  }

  const loginHandler = async (e)=>{
    e.preventDefault();
    try{
      ws.send(JSON.stringify({...form, type:'signin'}))
    } 
    catch(e) {
      console.error(e);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form className="d-flex flex-column justify-content-center align-items-center mt-2 w-25 border shadow" >
        <div className="justify-content-center">
          <h2 className="d-flex mt-1">Авторизация</h2>
        </div>
        <div className="w-50">
          <label htmlFor="login" className="form-label">login:</label>
          <input type="text" className="form-control" id="login" placeholder="login" onChange={changeHandler}/>
        </div>
        <div className="w-50">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" className="form-control" id="password" placeholder="password" onChange={changeHandler}/>
        </div>
        <div className=" d-flex w-50 justify-content-between mb-3 mt-1">
          <button className="btn btn-primary mt-2 " onClick={loginHandler}>Войти</button>       
          <Link to="/reg" className="mt-3 " >Нет аккаунта?</Link>
        </div>
      </form>
    </div>    
  )
}

export default AuthPage;