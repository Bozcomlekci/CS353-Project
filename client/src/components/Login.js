import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  loginBox: {
    border: '1px solid black',
    width: 'fit-content'
  },
  loginText: {
    fontSize: '32px',
    textAlign: 'center'
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
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
  
    onLogin(sess.data);
  }

  const classes = useStyles();

  return (
    <div className={classes.loginBox}>
      <p className={classes.loginText}>Login</p>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField required id="outlined-basic" label="Username" name="username" variant="outlined" placeholder="Username"/>
        <TextField required id="outlined-basic" label="Password" name="password" type="password" variant="outlined" placeholder="Password"/>
        <Button variant="contained" type="submit">Login</Button>
      </form>
    </div>
  );
}
