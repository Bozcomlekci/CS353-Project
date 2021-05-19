import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  addressBox: {
    border: '1px solid black',
    width: 'fit-content',
    margin: "15px",
    padding: '25px',
    display: "flex",
    flexDirection: "row",
    "& p, h3": {
      margin: "0",
      padding: "0"
    }
  }
}));

export default function AddressBox(props) {
  const [addresses, setAddresses] = useState(null);
  const classes = useStyles();

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

  async function deleteAddress(adddress_id) {
    await axios.get('http://localhost:9000/address/customer',{
      params:{
        address_id: adddress_id
      }}, {withCredentials: true});
    console.log(addresses.data, "YEEEET");
    return addresses.data;
  }

  function renderAddresses() {
    let adr = [];
    for (let i = 0; i < addresses.length; i++) {
      adr.push(<div style={{
        border: '1px solid black',
        padding: '15px'
      }}>
        <h3>{addresses[i].explanation}</h3>
        <p>Street Name:{addresses[i].street}</p>
        <p>Street/APT Number:{addresses[i].street_number},  {addresses[i].apt_number}</p>
        <p>City:{addresses[i].city}</p>
        <p>County:{addresses[i].county}</p>
        <p>ZIP Code:{addresses[i].zip}</p>
        <Button variant="contained" color="primary" onClick={() => deleteAddress(addresses[i].address_id)}>Delete Address</Button>
      </div>);
    }
    return adr;
  }

  return addresses ?  (
  <div>
    <div className={classes.addressBox}>
      {renderAddresses()}
      <Button variant="contained" color="secondary">Add Address</Button>
      </div>
  </div>
  ): (<span>Loading Addresses</span>);
}
