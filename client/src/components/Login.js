import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  loginBox: {
    //margin: '0 auto',
    display: 'flex',
    //justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid black',
    width: '100%',
    height: '100%',
    backgroundColor: 'lightblue'
  },
  loginText: {
    fontSize: '32px',
    textAlign: 'center'
    
  },
  titleText: {
    fontSize: '32px',
    textAlign: 'left',
    color : 'white',
    textAlign: 'center',
    marginRight: '5px',
    paddingLeft: '85px'
  },
  smallerTitleText: {
    fontSize: '32px',
    textAlign: 'left',
    color : 'white',
    textAlign: 'center',
    marginRight: '5px',
    paddingLeft: '85px'

  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: '30ch',
      display: 'flex'
    },
  },
}));

export default function Login(props) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let onLogin = props.onLogin;
  
    const sess = await axios.post('http://localhost:9000/login', {
      username: event.target.username.value,
      password: event.target.password.value
    }, {withCredentials: true});
    /*
    .then((res) => {
      return res.data.loggedIn;
    }, (err) => {
      console.error(err);
      return false;
    });
    */
   console.log("SESSSSSSS", sess.data.loggedIn);
   if (!sess.data.loggedIn) {
    alert("Wrong username or password");
   }
   console.log("SESSSSSSS", sess.data);

    onLogin(sess.data);
  }

  const classes = useStyles();

  return (
    
    <div className={classes.loginBox} style={{
      backgroundColor: 'lightblue',
      width: '100%',
      height: '100%'
    }}>
      <div  style={{
      backgroundColor: '#f50057',
      width: '100%',
      height: '10%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
      }}>
        <h2 className={classes.titleText}></h2>
        <h1 className={classes.titleText}>YEMEK KUTUSU</h1>
        <h2 className={classes.smallerTitleText}>Signup</h2>
      </div>
      <p className={classes.loginText}>Login</p>
      <form className={classes.form} onSubmit={handleSubmit} >
        
        <TextField required id="outlined-basic" label="Username" name="username" variant="outlined" placeholder="Username"/>
        <TextField required id="outlined-basic" label="Password" name="password" type="password" variant="outlined" placeholder="Password"/>
        <Button variant="contained" type="submit">Login</Button>
      </form>
    </div>
  );
}
