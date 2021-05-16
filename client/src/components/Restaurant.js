import React from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';

const useStyles = makeStyles((theme) => ({
}));

export default function Restaurant(props) {
  const { id } = useParams();
  const classes = useStyles();
  
  return (
    <div>
        <h1>Restaurant {id}</h1>
        <OrderableList restaurant_id={id}/>
    </div>
  );
}
