import React from 'react';
import krol from '../hqdefault.jpg'

const Krol = ()=>{
  return (
    <div className='d-flex justify-content-center align-items-center' style={{minHeight: '80vh' }}>
      <img src={krol} alt="Абалдеть"  style={{maxHeight: '360px', maxWidth: '480px' }}/>
    </div>
  )
}

export default Krol