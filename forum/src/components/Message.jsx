import React from 'react';

export const Message = (props)=>{
  return (
    <li className="list-group-item border-0">
      <div className={`d-flex w-100 ${props.isSelfMessage ? 'justify-content-end' : 'justify-content-start'}`} >{props.text}{props.isSelfMessage ? ' - Вы' : ' - '+ props.author}</div>
    </li>
  )
}