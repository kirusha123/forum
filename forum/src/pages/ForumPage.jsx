import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate, createSearchParams} from 'react-router-dom'

import '../styles/forumPage.css'
import '../components/Message'
import { Message } from '../components/Message';
import { AuthContext } from '../context/AuthContext';

const ForumPage = ()=>{
  const auth = useContext(AuthContext)
  const ws = useRef(null);
  const scrolingRef = useRef()
  const [user, setUser] = useState(auth.token)
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [curMessage, setCurMessage] = useState('');
  const navigate = useNavigate()
  
  useEffect(()=>{
    ws.current = new WebSocket('ws://127.0.0.1:2000');
    gettingData()
    ws.current.onopen = () =>{
      console.log("Соединение открыто");
    } 
    ws.current.onclose = () => console.log("Соединение закрыто");
    return ()=>{
      ws.current.close()
    }
  }, [ws])


  const gettingData = useCallback(() => {
    if (!ws.current) return;
    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);
        if (data.type === 'start'){
          setUsers(data.users.map(user=>user.login));
          setMessages(data.result);
          setTimeout(scrolingRef.current.scrollIntoView({ behavior: "smooth" }),1000);
        }
        if (data.type === 'newmessage'){
          setMessages((pervState=>[...pervState, data.result]));
          setTimeout(scrolingRef.current.scrollIntoView({ behavior: "smooth" }),1000);
        }
    };
  });

  const inputHandler = (e)=>{
    setCurMessage(e.target.value)
  }

  const messageSendHandler = (e)=>{
    e.preventDefault();
    if (!curMessage.length) return;
    try{
      ws.current.send(JSON.stringify({type:'newmessage', author: user, text: curMessage}));
      setCurMessage('');
    }catch(error){
      console.log(error);
    }
  }

  const clickUserHandler = (user)=>{
    const params = {
      user:user,
    }
    navigate({
      pathname:`/privateMessanger`,
      search:`?${createSearchParams(params)}`,
    })
  }

  return(
    <div className='d-flex justify-content-center flex-column align-items-center'>
      <div className="d-flex flex-row justify-content-around">
        <div className="d-flex flex-column">
          <div className="forum-block shadow mt-2">
            <ul className=' list-group w-100'>
              {
                messages.map((message,idx)=>{
                  return <Message key={idx}  author={message.author} isSelfMessage={message.author == user} text={message.text}/>
                })
              }
              <div ref={scrolingRef} ></div>
            </ul>              
          </div>
          <div className="typing-block justify-content-start mt-3 shadow">
            <input className="h-50 ms-4 input-group-text align-self-center w-75"  placeholder='Введите сообщение' type="text" value={curMessage} onChange={inputHandler} />
            <button className='btn btn-primary align-self-center ms-1 me-4' onClick={messageSendHandler}>Отправить</button>
           </div>
        </div>
        <div className='d-flex flex-column shadow ms-2 h-25 user-container'>
          <span className='self-align-start'>Пользователи:</span>
          { 
            users.length &&   
            users.map((us,idx)=>{
              if (us != user)
              return(
                <div key={idx} onClick={(()=>clickUserHandler(us))} className="d-flex clickable-item border-2 border-top">
                  <span className='ms-3'>{ us }</span>
                </div>
              )
            })
          }
        </div>
      </div>   
    </div>
  )
}

export default ForumPage;