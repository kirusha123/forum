import React, {useState, useRef, useEffect, useContext, useCallback} from 'react';
import { useSearchParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { Message } from '../components/Message';
import '../styles/privateMessangerPage.css'
import _ from 'lodash'
 
const PrivateMessanger = ()=>{
  let scrolingRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useContext(AuthContext)
  const ws = useRef(null);
  const [user, setUser] = useState(auth.token);
  const [messages, setMessages] = useState([]);
  const [curMessage, setCurMessage] = useState('');
  
  useEffect(()=>{
    ws.current = new WebSocket('ws://127.0.0.1:2000');
    ws.current.onopen = () => {
      console.log("Соединение открыто");
      ws.current.send(JSON.stringify({type:'getDialogs', from: user, to: searchParams.get('user')}))
    };
    ws.current.onclose = () => console.log("Соединение закрыто");
    gettingData();
    return ()=>{
      ws.current.close()
    }
  }, []);


  const gettingData = useCallback(() => {
    if (!ws.current) return;
    ws.current.onmessage  = e => {
      const data = JSON.parse(e.data);
      if (data.type === 'getDialogs'){
        const messages = data.result[0].messages;
        const authors = data.result[0].authors;
        const formatedMessages = messages.map((msg,idx)=>{ return {text: msg.message, author: authors[idx].author} })
        setMessages(formatedMessages);
        setTimeout(scrolingRef.current.scrollIntoView({ behavior: "smooth" }),1000);

      }
      if (data.type == 'newPrivateMessage'){
        const msg  = { text: data.result.text, author: data.result.from};
        setMessages((pervState)=>[...pervState, msg]);
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
      ws.current.send(JSON.stringify({type:'newPrivateMessage', from: user, to: searchParams.get('user'), text: curMessage  }));
      setCurMessage('');
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className='d-flex justify-content-center flex-column align-items-center'>
      <div className="d-flex flex-row justify-content-around">
        <div className="d-flex flex-column">
          <div className="forum-block shadow mt-2">
            <ul className=' list-group w-100'>
              {messages.length&&
                messages.map((message,idx)=>{
                  return <Message key={idx}  author={message.author} isSelfMessage={message.author == user} text={message.text}/>
                })
              }
              <div ref={scrolingRef}></div>
            </ul>              
          </div>
          <div className="typing-block justify-content-start mt-3 shadow">
            <input className="h-50 ms-4 input-group-text align-self-center w-75"  placeholder='Введите сообщение' type="text" value={curMessage} onChange={inputHandler} />
            <button className='btn btn-primary align-self-center ms-1 me-4' onClick={messageSendHandler}>Отправить</button>
           </div>
        </div>
      </div>   
    </div>
  )
}

export default PrivateMessanger;