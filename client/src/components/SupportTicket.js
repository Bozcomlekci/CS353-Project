import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';


const useStyles = makeStyles((theme) => ({
ticketBox: {
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid black',
    width: 'fit-content'
  },
  ticketText: {
    fontSize: '32px',
    textAlign: 'center'
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
      display: 'flex',
    },
   },
}));

export default function SupportTicket(props) {
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const sess = await axios.post('http://localhost:9000/support/writeticket', {
        date : (new Date()).toISOString(),
        subject : event.target.subject.value,
        content : event.target.content.value,
        username : props.user.username,
        type : props.body.type
    }, {withCredentials: true});
  }

  const classes = useStyles();
  const [tickets, setTickets] = useState(undefined);

  async function getTickets() {
    const orders = await axios.get('http://localhost:9000/order/customer', {
        withCredentials: true
    });
    return orders.data;
  }


  function renderOrders() {
     //To be written
  }

  return (
    <div className={classes.ticketBox}>
      <p className={classes.ticketText}>Send Ticket</p>
      <form className={classes.form} onSubmit={handleSubmit}>
        <FormLabel component="legend">Subject</FormLabel>
        <RadioGroup aria-label="type" name="type">
            <FormControlLabel value="Food" control={<Radio />} label="Food" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
        </RadioGroup>
        <TextField required id="outlined-basic" label="Username" name="subject" variant="outlined" placeholder="subject"/>
        <TextField required id="outlined-basic" label="First Name" name="content" variant="outlined" placeholder="content"/>
        <Button color="primary" variant="contained" type="submit">SUBMIT TICKET</Button>
      </form>
    </div>
  );
}