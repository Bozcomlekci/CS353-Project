import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';

const useStyles = makeStyles((theme) => ({
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
        <div>
          <a href={"./" + restaurant.restaurant_id}>{restaurant.name}</a>
          <div>Rating:{restaurant.average_rating}</div>
          <div>Open:{String(restaurant.is_open)}</div>
          <div>City:{restaurant.city}</div>
          <div>County:{restaurant.county}</div>
        </div>
        )
      }
      return rendered;
  }
  return restaurants ? (<div>
    {renderRestaurants()}
  </div>) : (
    <span>Loading restaurants</span>
  );
}
