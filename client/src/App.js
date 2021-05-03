import './App.css';
import React from 'react';
import axios from 'axios'
import Navbar from './components/Navbar';
import HomePageNotLoggedIn from './HomepageNotLoggedIn';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddressBox from './components/AddressBox';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: {}
    }
  }

  componentDidMount = async () => {
    const sess = await this.getSession();
    console.log(sess);
    console.log('DID MOUNT', sess);
    this.setState({
      loggedIn: sess.loggedIn,
      user: sess.user
    });
  }
  
  getSession = async () => {
    return axios.get('http://localhost:9000/loggedin', {withCredentials: true})
    .then((res) => {
      console.log(res);
      if (res.data.loggedIn) {
        console.log('hurray');
        return {
          loggedIn: res.data.loggedIn,
          user: res.data.user
        };
      }
      else {
        console.log('nanay');
        return {
          loggedIn: res.data.loggedIn
        };
      }
    }, (error) => {
      console.log(error);
      return false;
    });
  }
  
  onAuthChange = (session) => {
    this.setState({
      loggedIn: session.loggedIn,
      user: session.user
    });
  }

  render = () => {
    if (!this.state.loggedIn) {
      return (
        <HomePageNotLoggedIn loggedIn = {this.state.loggedIn} onLogin = {(l) => this.onAuthChange(l)}/>
      );
    }
    else {
      return (
        <Router>
          <Navbar loggedIn = {this.state.loggedIn} onLogout = {(l) => this.onAuthChange(l)}/>
          <Switch>
            <Route exact path="/addresses">
              <h1>Addresses</h1>
              <AddressBox/>
            </Route>
            <Route exact path="/box">
              <h1>BOX</h1>
            </Route>
            <Route path="/">
              <div>
                <h1>LOGGED IN</h1>
              </div>
            </Route>
          </Switch>
        </Router>
      );
    }
  }
}

export default App;
