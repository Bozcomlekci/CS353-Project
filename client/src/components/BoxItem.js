import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
}));

export default function BoxItem(props) {
  const [quantity, setQuantity] = useState(props.quantity)
  const classes = useStyles();

    return (<div style={{
      border: '1px solid black',
      width: 'fit-content',
      margin: '15px',
      padding: '15px'
    }}>
        <p>Orderable Name: {props.orderable.orderable_name}</p>
        <p>Orderable Price: {props.orderable.price} TL</p>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <p>Quantity:</p>
          
          <TextField style={{
            width: '50px'
          }} type="number" value={quantity} onChange={(e) => {
          setQuantity(Math.max(e.target.value, 0));
          }}/>
        </div>
        <Button onClick={() => props.handleUpdate(props.index, quantity)}>Update Quantity</Button>
        <Button onClick={() => props.handleDelete(props.index)}>Delete</Button>
    </div>);
}
