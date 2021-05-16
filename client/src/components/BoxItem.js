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

    return (<div>
        {props.orderable.orderable_name}
        <Button onClick={() => props.handleDelete(props.index)}>Delete</Button>
        <TextField type="number" value={quantity} onChange={(e) => {
        setQuantity(Math.max(e.target.value, 0));
        }}/>
        <Button onClick={() => props.handleUpdate(props.index, quantity)}>Update</Button>
    </div>);
}
