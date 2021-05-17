import React from 'react';
import Login from './components/Login';

export default function HomePageNotLoggedIn(props) {

  return (
    <div>
      <Login loggedIn={props.loggedIn} onLogin={props.onLogin} />
    </div>
  );
}
