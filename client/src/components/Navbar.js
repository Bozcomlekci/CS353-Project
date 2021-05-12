import React from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';

class Navbar extends React.Component {

  logout = async () => {

    let onLogout = this.props.onLogout;

    const sess = await axios.get('http://localhost:9000/logout', {withCredentials: true});
    /*
    .then((res) => {
        return res.data.loggedIn;
      }, (error) => {
      console.error(error);
      return false;
    });
    */

    onLogout(sess.data);
  }

  render() {
    let button = null;
    if (this.props.loggedIn) {
      button = <Button href="#" color="primary" onClick={this.logout}>Logout</Button>;
    }
    
    return (
      <nav>
        <a href="/">YemekKutusu</a>
        <a href="/restaurants/">Restaurants</a>
        <a href="/addresses">Addresses</a>
        <a href="/B">Orders</a>
        <a href="/box">Box</a>
        {button}
      </nav>
    );
  }
}

export default Navbar;
