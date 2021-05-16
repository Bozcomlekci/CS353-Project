import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BoxItem from './BoxItem';

const useStyles = makeStyles((theme) => ({
}));

export default function CustomerHomePage(props) {
  const [amount, setAmount] = useState(0);
  const classes = useStyles();

  return (<div>
  <h1>HOMEPAGE</h1>
  <div>{JSON.stringify(props.user)}</div>
  </div>);
}
