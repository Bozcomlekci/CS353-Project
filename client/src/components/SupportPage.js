import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
}));

export default function SupportPage(props) {
    const [tickets, setTickets] = useState(undefined);
    const classes = useStyles();
  
    async function getTickets() {
      const tickets = await axios.get('http://localhost:9000/support/listticket', {
          withCredentials: true
      });
      console.log(tickets);
      return tickets.data;
    }
  
    useEffect(() => {
        getTickets().then(res => {
          setTickets(res);
        });
    }, [props]);
  
    function renderTickets() {
        let rendered = [];
        for (const ticket of tickets) {
          rendered.push(
          <div>
            <a href={"./" + ticket.ticket_id}>{tickets.name}</a>
            <div>Date:{ticket.date}</div>
            <div>Subject:{ticket.subject}</div>
            <div>Content:{ticket.content}</div>
            <div>Response:{ticket.response}</div>
          </div>
          )
        }
        return rendered;  
    }

    function openTicketSubmission() {
        console.log('Bi seyler');
        //Look at this https://stackoverflow.com/questions/47574490/open-a-component-in-new-window-on-a-click-in-react
    }

    return tickets ? (
        <div>
        <p>Send Ticket</p>
        {renderTickets()}
        <Button color="primary" variant="contained" type="submit" onClick={() => openTicketSubmission()}>CREATE NEW TICKET</Button>
        </div>
        ) : (
      <span>Loading tickets</span>
    );
}
