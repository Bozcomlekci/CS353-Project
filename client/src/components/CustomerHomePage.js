import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BoxItem from './BoxItem';
import OrderableList from './OrderableList';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 100,
    width: 500,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  signupBox: {
     margin: '0 auto',
 
     display: 'flex',
     justifyContent: 'center',
     flexDirection: 'column',
     alignItems: 'center',
     border: '1px solid black',
     width: 'fit-content'
   },
   signupText: {
     fontSize: '32px',
     textAlign: 'center'
   },
   titleText: {
     fontSize: '32px',
     textAlign: 'left',
     color : 'white'
   },
   form: {
     '& > *': {
     
       
       margin: theme.spacing(1),
       width: '25ch',
       display: 'flex',
     },
 
    },
 
 }));

export default function CustomerHomePage(props) {
  const [amount, setAmount] = useState(0);
  const classes = useStyles();

  

  return (<div>
  <h1>HOMEPAGE</h1>
  <Paper className={classes.paper} elevation={3} color='blue'>
            <div>
            <Typography variant="h5">
              Username: {props.user.username}
            </Typography>
            <Typography variant="h5">
              Usertype: {props.user.type}
            </Typography>
            </div>
  </Paper>
  </div>);
}
