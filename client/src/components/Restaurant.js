import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';

const useStyles = makeStyles((theme) => ({
}));

export default function AddressBox(props) {
  const classes = useStyles();
  
  return (
    <div>
        <h1>Restaurant {props.restaurantID}</h1>
        <OrderableList restaurant_id={props.restaurant_id}/>
    </div>
  );
}
