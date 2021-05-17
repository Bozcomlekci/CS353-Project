import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';
import ItemTable from './ItemTable';
import AddItem from './AddItem';
import AddOrderable from './AddOrderable';
import OrderableTable from './OrderableTable';
import OrderableItemsTable from './OrderableItemsTable';
import OrdersTable from './OrdersTable';



const useStyles = makeStyles((theme) => ({
}));

export default function OwnerHomePage(props) {
  const { id } = useParams();
  const classes = useStyles();
  const [managedRestaurant, setManagedRestaurant] = React.useState(props.user.restaurant);
  const [restaurants, setRestaurants] = React.useState(null);

  async function changeManagedRestaurant(restaurant) {
    const items = await axios.post('http://localhost:9000/userInfo/set_current_restaurant', {
        restaurant: restaurant
    },{withCredentials: true});
    setManagedRestaurant(restaurant);
  }
  
  useEffect(() => {
    getRestaurants().then(res => {
      setRestaurants(res);
    });
  }, []);

  async function getRestaurants() {
    const restaurants = await axios.get('http://localhost:9000/userinfo/restaurants', {withCredentials: true});
    return restaurants.data;
  }

  function renderRestaurants() {
    let rendered = [];
    for (let i = 0; i < restaurants.length; i++) {
        let restaurant = restaurants[i];
        rendered.push(
        <div>
        <Button onClick={() => changeManagedRestaurant(restaurant)}>{restaurant.name}</Button>
        <div>Rating:{restaurant.average_rating}</div>
        <div>Open:{String(restaurant.is_open)}</div>
        <div>City:{restaurant.city}</div>
        <div>County:{restaurant.county}</div>
      </div>
      )
    }
    return rendered;
  }

  if (managedRestaurant == null && restaurants == null) {
      return (<span>Loading restaurants</span>)
  }
  else if (managedRestaurant == null && restaurants != null) {
      return ( <div>
        <h1>HOMEPAGE</h1>
        <div>{JSON.stringify(props.user)}</div>
        <div>{renderRestaurants()}</div>
    </div>)
  }
  else {
    return  (
        <div>
            <Button onClick={() => changeManagedRestaurant(null)}>Change Restaurant</Button>
            <div>
                <h1>Restaurant: {managedRestaurant.name} {managedRestaurant.restaurant_id}</h1>
            </div>
            <OrderableTable restaurant={managedRestaurant}/>
            <AddOrderable/>
            <OrdersTable/>
        </div>
      );

  }
}
