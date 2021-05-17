import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Container } from '@material-ui/core';
import TextField from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      type: "restaurant"
    };
  }


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
      button = <Button href="#" color="white" onClick={this.logout}>Logout</Button>;
    }
    
      return (
        <div  style={{
          backgroundColor: 'blue',
          width: '100%',
          height: '20%'
          }}>
  
        <Select
          labelId="type-label"
          id="type"
          value={this.state.type}
          onChange={(e) => this.setState({type: e.target.value})}
          >
          <MenuItem value={"restaurant"}>Restaurant</MenuItem>
          <MenuItem value={"item"}>Item</MenuItem>
          <MenuItem value={"address"}>Address</MenuItem>
      </Select>
        <TextField id="outlined-search" label="Search field" type="search" variant="outlined" placeholder="Search Items" onChange={(e) => {this.setState({searchValue: e.target.value})}}/>
         <Button onClick={()=>alert(this.state.searchValue)}>Search</Button>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">
                YEMEK KUTUSU
              </Typography>
              
              <Container>
              \ <a href="/">YemekKutusu</a> \
              </Container>
              <Container>
              \ <a href="/restaurants/">Restaurants</a> \
              </Container>
              <Container>
              \ <a href="/addresses">Addresses</a> \
              </Container>
              <Container>
              \ <a href="/orders">Orders</a> \
              </Container>
              <Container>
              \ <a href="/box">Box</a>  \
              </Container>
              {button}
            </Toolbar>
           
            
            
          </AppBar>
          </div>
      );
  }
}

export default Navbar;
