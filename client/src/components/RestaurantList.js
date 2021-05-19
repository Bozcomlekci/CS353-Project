import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row'
  },
  paper: {
    height: 150,
    width: 200,
    padding: '25px',
    margin: '30px',
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));



export default function RestaurantList(props) {
  const [restaurants, setRestaurants] = useState(undefined);
  const classes = useStyles();

  async function getRestaurants() {
    const restaurants = await axios.get('http://localhost:9000/restaurant/list_restaurants', {
        withCredentials: true
    });
    console.log(restaurants);
    return restaurants.data;
  }

  useEffect(() => {
    getRestaurants().then(res => {
        setRestaurants(res);
    });
  }, [props]);

  function renderRestaurants() {
      let rendered = [];
      for (const restaurant of restaurants) {
        rendered.push(
        <Paper className={classes.paper} elevation={3}>
              <a href={"./" + restaurant.restaurant_id}
              >
              <Typography variant="h5">
              {restaurant.name}
              </Typography>
              </a>
          <Box color='blue'>
            <div>
            <Typography variant="h6">
              Rating: {restaurant.average_rating}
            </Typography>
             
            </div>
            <div>Open: {String(restaurant.is_open)}</div>
            <div>City: {restaurant.city}</div>
            <div>County: {restaurant.county}</div>
          </Box>
        </Paper>
        )
      }
      return rendered;
  }
  return restaurants ? (<div className={classes.root}>
  
    {renderRestaurants()}
  </div>) : (
    <span>Loading restaurants</span>
  );
}
