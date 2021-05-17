import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Orderable from './Orderable';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
}));

export default function OrderableList(props) {
  const [orderables, setOrderables] = useState(undefined);
  const classes = useStyles();
  
  async function getOrderables(restaurant_id) {
    console.log(1231231);
    const orderables = await axios.get('http://localhost:9000/restaurant/list_orderables', {
        params: {
            restaurant_id: restaurant_id
        },
        withCredentials: true
    });
    console.log(orderables);
    return orderables.data;
  }

  useEffect(() => {
    getOrderables(props.restaurant_id).then(res => {
        setOrderables(res);
    });
  }, [props]);

  function renderOrderables() {
      let rendered = [];
      for (const orderable of orderables) {
        rendered.push(
          <Paper className={classes.paper} elevation={3}>
              <Orderable orderable={orderable} restaurant_id={props.restaurant_id}/>
          </Paper>
        )
      }
      return rendered;
  }

  return orderables ? renderOrderables() : (
    <span>Loading orderables</span>
  );
}
