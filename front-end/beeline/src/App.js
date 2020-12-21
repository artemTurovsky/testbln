import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ChatRoom, Welcome } from './pages'
import './App.css'


function App() {

  const [userExist, setUserExist] = useState({
    authenticated: false,
    userName: null
  });
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    async function fetchUserExist() {
      try {
        const req = await fetch('/sessinonCheck', {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await req.json();
        if (data.authenticated) {
          setUserExist({ authenticated: true, userName: data.userName });
        } else {
          setUserExist({ authenticated: false, userName: null });
        }
        setServerError(false);
      } catch (error) {
        console.log(error);
        setServerError(true);
      }
    }
    fetchUserExist();
  }, [])

  return (
    <Router>
      <Switch>
        <Route path='/chat'>
        { userExist.authenticated ? <ChatRoom userName={userExist.userName}/> : <Redirect to='/' />}
        </Route>
        <Route path='/'>
          { userExist.authenticated ? <Redirect to='/chat' /> : <Welcome serverError={serverError} setServerError={setServerError} setUserExist={setUserExist} /> }
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
