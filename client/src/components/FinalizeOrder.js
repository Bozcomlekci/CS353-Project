import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import BoxItem from './BoxItem';

const useStyles = makeStyles((theme) => ({
  address: {
    border: '1px solid black',
    width: 'fit-content',
    margin: "15px",
    "& p, h3": {
      margin: "15",
      padding: "5"
    }
  }
}));

export default function FinalizeOrder(props) {
  const [plastic, setPlastic] = useState(true);
  const [note, setNote] = useState("");
  const classes = useStyles();
  const [addresses, setAddresses] = useState(null);
  const [orderAddress, setOrderAddress] = useState(null);
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


  useEffect(() => {
    getAddress().then(res => {
      setAddresses(res);
    });
  }, []);

  async function getAddress() {
    const addresses = await axios.get('http://localhost:9000/address/customer', {withCredentials: true});
    console.log(addresses.data, "YEEEET");
    return addresses.data;
  }

  function renderAddresses() {
    let adr = [];
    for (let i = 0; i < addresses.length; i++) {
      adr.push(<div className={classes.address} style={{
        border: '1px solid black',
        padding: '15px'
      }}>
        <h3>{addresses[i].explanation}</h3>
        <p>Street Name:{addresses[i].street}</p>
        <p>Street/APT Number:{addresses[i].street_number},  {addresses[i].apt_number}</p>
        <p>City:{addresses[i].city}</p>
        <p>County:{addresses[i].county}</p>
        <p>ZIP Code:{addresses[i].zip}</p>
        <Button onClick={() => setOrderAddress(addresses[i].address_id)}>Choose Address</Button>
      </div>);
    }
    return adr;
  }
  
  return addresses ? (<div style={{
    margin: '0 40%'
  }}>
  <h1>FINALIZE ORDER</h1>
    Order Note:
    <TextField id="name" label="Order Note" variant="outlined" placeholder="Order Note" onChange={(e) => setNote(e.target.value)}/>
    <br></br>
    Include Plastic (Disposable Items):
    <Select
      labelId="type-label"
      id="type"
      value={plastic}
      onChange={(e) => setPlastic(e.target.value)}
      >
      <MenuItem value={true}>Yes</MenuItem>
      <MenuItem value={false}>No</MenuItem>
    </Select>
    <br></br>
    Time To Deliver:
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
    <div>
      {renderAddresses()}
    </div>
    <Button style={{
      backgroundColor: '#f50057',
      margin: '15px'
    }} onClick={() => {
        makeOrder();
    }
    }>Make Order</Button>
  </div>): <></>;
}
