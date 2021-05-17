import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BoxItem from './BoxItem';

const useStyles = makeStyles((theme) => ({
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
  <div>{JSON.stringify(props.user)}</div>
  </div>);
}
