import './App.css';
import React from 'react';
import axios from 'axios'
import Navbar from './components/Navbar';
import HomePageNotLoggedIn from './HomepageNotLoggedIn';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddressBox from './components/AddressBox';
import Restaurant from './components/Restaurant';
import RestaurantList from './components/RestaurantList';
import Signup from './components/Signup';

import Box from './components/Box';
import FinalizeOrder from './components/FinalizeOrder';
import CustomerHomePage from './components/CustomerHomePage';
import OwnerHomePage from './components/OwnerHomePage';
import DeliveryHomePage from './components/DeliveryHomePage';
import Orders from './components/Orders';
import SupportTicket from './components/SupportTicket';

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

  HomePage = (user) => {
    if (user.type == "Customer") {
      return <CustomerHomePage user={user}/>;
    } else if (user.type == "RestaurantOwner") {
      return <OwnerHomePage user={user}/>;
    } else if (user.type == "SupportStaff") {
      
    } else if (user.type == "DeliveryPerson") {
      return <DeliveryHomePage user={user}/>;
    }

  }

  render = () => {
    if (!this.state.loggedIn) {
      return (
        <Router>
         <Switch>
          <Route exact path="/signup/">
              <Signup/>
            </Route>

            <Route path="/">
            <HomePageNotLoggedIn loggedIn = {this.state.loggedIn} onLogin = {(l) => this.onAuthChange(l)}/>
            </Route>

            </Switch>
        </Router>
        
      );
    }
    else {
      return (
        <Router>
          <Navbar loggedIn = {this.state.loggedIn} user = {this.state.user} onLogout = {(l) => this.onAuthChange(l)}/>
          <Switch>
            <Route exact path="/addresses">
              <h1>Addresses</h1>
              <AddressBox/>
            </Route>
            <Route exact path="/box">
              <Box/>
            </Route>
            <Route exact path="/orders">
              <Orders/>
            </Route>
            <Route exact path="/add_option">
              <h1>ADD OPTION</h1>
            </Route>
            <Route exact path="/finalize_order">
              <FinalizeOrder/>
            </Route>
            <Route path="/restaurants/:id">
              <Restaurant/>
            </Route>
            <Route exact path="/restaurants/">
              <RestaurantList/>
            </Route>
            <Route exact path="/support/">
              <SupportTicket/>
            </Route>
            <Route path="/">
              {this.HomePage(this.state.user)}
            </Route>
          </Switch>
        </Router>
      );
    }
  }
}
export default App;
