import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddressBox from './AddressBox';
import CreditBox from './CreditBox';

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
    margin: '98px'
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
  const classes = useStyles();


  return (
  <div>
    <h1>CUSTOMER HOMEPAGE</h1>
    <div style = {{
      display: 'flex',
      flexDirection: 'row'
    }}>
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
      <AddressBox/>
      <CreditBox/>
    </div>
  </div>);
}
