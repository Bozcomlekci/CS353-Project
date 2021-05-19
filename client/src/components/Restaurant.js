import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';
import Reviews from './Reviews';

const useStyles = makeStyles((theme) => ({
  restaurantClass: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  title: {
    textAlign: 'center',
    borderBottom: '1px solid'
  }
}));

export default function Restaurant(props) {
  const [restaurant, setRestaurant] = useState(undefined);
  const { id } = useParams();
  const classes = useStyles();
  
  async function getRestaurants() {
    const restaurants = await axios.get('http://localhost:9000/restaurant/list_restaurants', {
        withCredentials: true
    });
    console.log(restaurants.data.filter(restaurant => restaurant.restaurant_id == id)[0], "TESSSSSSSSSSt");
    return restaurants.data.filter(restaurant => restaurant.restaurant_id == id)[0];
  }


  useEffect(() => {
    getRestaurants().then(res => {
      setRestaurant(res);
    });
  }, [props]);

  return restaurant ? (
    <div>
        <h1 className={classes.title}>{restaurant.name}</h1>
        <div className={classes.restaurantClass}>
          <OrderableList restaurant_id={id}/>
          <Reviews restaurant_id={id}/>
        </div>
    </div>
  ) : <span>Loading Restaurant Info</span>;
}
