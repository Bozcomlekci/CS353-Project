import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import BoxItem from './BoxItem';

const useStyles = makeStyles((theme) => ({
}));

export default function Box(props) {
  const [box, setBox] = useState(undefined);
  const [amount, setAmount] = useState(0);
  const classes = useStyles();

  async function getBox() {
    const currentBox = await axios.get('http://localhost:9000/box/get', {
      withCredentials: true
    });
    return currentBox.data;
  }

  useEffect(() => {
    getBox().then(res => {
      setBoxItemsAndPrice(res);
    });
  }, []);

  function setBoxItemsAndPrice(box) {
    setBox(box);
    let amount = 0;
    console.log(box);
    if (box.length == 0) {
      setAmount(0);
    }
    else {
      for (let i = 0; i < box.length; i++) {
        amount += box[i].quantity * box[i].price;
        console.log("AMOUNT: ", amount);
      }
      setAmount(amount);
      window.sessionStorage.setItem("amount", amount);
    }
  }

  async function makeOrder() {
    await axios.post('http://localhost:9000/order/create', {
      has_plastic: true,
      note: "note"
    }, {withCredentials: true});
  }

  async function handleDelete(index) {
    const box = await axios.get('http://localhost:9000/box/remove', {
      params: {
        index: index
      },
      withCredentials: true
    })

    setBoxItemsAndPrice(box.data);

    alert("AB123");
  }

  async function handleUpdate(index, quantity) {
    const box = await axios.get('http://localhost:9000/box/update', {
      params: {
        index: index,
        quantity: quantity
      },
      withCredentials: true
    })

    setBoxItemsAndPrice(box.data);

    alert("AB123");
  }

  function renderBox() {
    let rendered = [];
    for (let i = 0; i < box.length; i++) {
      rendered.push(<BoxItem quantity={box[i].quantity} orderable={box[i]} index={i} handleDelete={handleDelete} handleUpdate={handleUpdate}/>);
    }
    console.log(box);
    return rendered;
  }
  //<Button onClick={() => makeOrder()}>Make Order</Button>
  
  return box ? (<div>
    <div>
      {renderBox()}
    </div>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
    }}>
      <Button style={{
        backgroundColor: '#f50057',
        margin: '15px'
      }} href="/finalize_order">Make Order</Button>
      <p>Order Total: {amount} TL</p>
    </div>
    <div>
    </div>
  </div>) : (
    <span>Loading box</span>
  )
}
