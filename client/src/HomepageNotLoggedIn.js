import React from 'react';
import Login from './components/Login';

export default function HomePageNotLoggedIn(props) {

  return (
    <div>
      <h1>HEY {String(props.loggedIn)}</h1>
      <Login loggedIn={props.loggedIn} onLogin={props.onLogin} />
    </div>
  );
}
