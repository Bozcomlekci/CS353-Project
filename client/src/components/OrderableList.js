import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Orderable from './Orderable';

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
        rendered.push(<Orderable orderable={orderable} restaurant_id={props.restaurant_id}/>)
      }
      return rendered;
  }

  return orderables ? renderOrderables() : (
    <span>Loading orderables</span>
  );
}
