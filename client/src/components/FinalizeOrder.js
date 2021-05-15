import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BoxItem from './BoxItem';

const useStyles = makeStyles((theme) => ({
}));

export default function FinalizeOrder(props) {
  const [amount, setAmount] = useState(0);
  const classes = useStyles();

  async function makeOrder() {
    await axios.post('http://localhost:9000/order/create', {
      has_plastic: true,
      note: "note"
    }, {withCredentials: true});
  }

  //<Button onClick={() => makeOrder()}>Make Order</Button>
  
  return (<div><h1>FINALIZE ORDER</h1></div>);
}
