import React, {useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useMessage } from '../hooks/message.hook';
import 'bootstrap'
export const Navbar = (props)=>{
  const auth = useContext(AuthContext)
  const navigate = useNavigate();
  const message = useMessage();
  const logoutMessage = 'Вы успешно вышли из системы'
  
  const logoutHandler = (event) => {
    event.preventDefault()
    auth.logout(navigate('/auth'))
    message(logoutMessage)
    console.log(logoutMessage)
    
  }
  
  const loginLogoutElement = () => {
    if (!props.isAuthentificated)  return (<Link className="nav-link active" to="/auth">Login</Link>)
    else return <Link className="nav-link active" onClick={logoutHandler} to="/auth">Logout</Link>
  }

  return (
    <nav className="container navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand " href="#">Forum</span>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className='nav-item'>
              <Link className={ props.isAuthentificated ? "nav-link active" : "nav-link disabled" } to="/forum" >Forum</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/krol" >krol</Link>
            </li>
            <li className="nav-item">
              {loginLogoutElement()}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
