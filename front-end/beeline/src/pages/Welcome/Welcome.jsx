import React, { useState } from 'react'

export default function Welcome(props) {

  const { setUserExist, serverError, setServerError } = props
  const [name, setName] = useState(null)

  async function registration(name) {
    try {
      const req = await fetch('/sessionStart', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name
        }),
      });
      const data = await req.json();
      setUserExist({ authenticated: true, userName: data.userName });
      setServerError(false);
    } catch (error) {
      console.log(error);
      setServerError(true);
    }
  }

  return (
    <div className='container'>
      <h2>
        Привет! Введи имя для того, что бы воспользоваться чатом
      </h2>
      <div id='formContainer'>
        <form 
          onSubmit={(e) => {
          e.preventDefault();
          registration(name);
        }}>
          <input
          required
          type='text'
          placeholder='Ваше имя'
          name='name'
          onChange={(e) => setName(e.target.value)}
          />
          <input
          type='submit'
          value='Продолжить'
          />
        </form>
        { serverError && <div id='errorMessage'>Что-то пошло не так</div>}
      </div>
    </div>
  )
}

