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
        <div style={{
          border: '1px solid black',
          padding: '20px',
          margin: '15px'
        }}>
        <Button onClick={() => changeManagedRestaurant(restaurant)}  style={{
          backgroundColor: '#f50057'
        }}>{restaurant.name}</Button>
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
        <h1>Welcome, {props.user.username}</h1>
        <h1>Your Restaurants</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>{renderRestaurants()}</div>
    </div>)
  }
  else {
    return  (
        <div>
            <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
            }}>
                <h1>Restaurant: {managedRestaurant.name} {managedRestaurant.restaurant_id}</h1>
                <Button onClick={() => changeManagedRestaurant(null)} style={{
                  backgroundColor: '#f50057',
                  padding: '5px 5px',
                  margin: '10px 10px'
                }}>Change Restaurant</Button>
            </div>
            <h3>Orderables</h3>
            <div style={{
              margin: '10px',
              padding: '10px',
              border: '1px solid black',
              width: '50%'
            }}>
              <OrderableTable restaurant={managedRestaurant}/>
            </div>
            <h3>Add Orderable</h3>
            <div style={{
              margin: '10px',
              padding: '10px',
              border: '1px solid black',
              width: 'fit-content'
            }}>
              <AddOrderable/>
            </div>
            <h3>Orders</h3>
            <div style={{
              margin: '10px',
              padding: '10px',
              border: '1px solid black',
              width: '60%'
            }}>
            <OrdersTable/>
            </div>
        </div>
      );

  }
}
