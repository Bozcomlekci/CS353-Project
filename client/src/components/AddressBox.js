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

export default function AddressBox(props) {
  const classes = useStyles();

  return (
    <div>
        <h1>Working?</h1>
    </div>
  );
}
