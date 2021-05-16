import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import BoxItem from './BoxItem';

const useStyles = makeStyles((theme) => ({
}));

export default function FinalizeOrder(props) {
  const [plastic, setPlastic] = useState(true);
  const [note, setNote] = useState("");
  const classes = useStyles();
  const [deliveryTime, setDeliveryTime] = useState((new Date()).toISOString().substring(0,16))
  const currentDate = new Date();

  async function makeOrder() {
    await axios.post('http://localhost:9000/order/create', {
      address_id: 1,
      has_plastic: plastic,
      note: note,
      time_to_deliver: deliveryTime
    }, {withCredentials: true});
  }

  
  return (<div>
  <h1>FINALIZE ORDER</h1>
    <TextField id="name" label="Order Note" variant="outlined" placeholder="Order Note" onChange={(e) => setNote(e.target.value)}/>
    <Select
      labelId="type-label"
      id="type"
      value={plastic}
      onChange={(e) => setPlastic(e.target.value)}
      >
      <MenuItem value={true}>Yes</MenuItem>
      <MenuItem value={false}>No</MenuItem>
    </Select>
    <TextField
      id="datetime-local"
      label="Next appointment"
      type="datetime-local"
      defaultValue={deliveryTime}
      className={classes.textField}
      InputLabelProps={{
        shrink: true
      }}
      onChange={(e) => setDeliveryTime(e.target.value)}
      inputProps= {{
        min: currentDate.toISOString().substring(0,16),
        max: (new Date(currentDate.getTime() + 86400000 * 1)).toISOString().substring(0,16)
      }}
    />
    <Button onClick={() => makeOrder()}>Make Order</Button>
  </div>);
}
