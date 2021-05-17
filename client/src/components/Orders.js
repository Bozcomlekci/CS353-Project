import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';

const useStyles = makeStyles((theme) => ({
}));

export default function Orders(props) {
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        getOrders().then(res => {
            setOrders(res);
        });
      }, []);

    async function getOrders() {
        console.log("DEEEEEEEEEEEEEBUG");
        const orders = await axios.get('http://localhost:9000/order/customer', {withCredentials: true});
        console.log(orders.data);
        return orders.data;
      }

    function renderOrders() {
        let it = [];
        for (let i = 0; i < orders.length; i++) {
            it.push(<div>
                <div>Restaurant Name: {orders[i].name}</div>
                <div>Status: {orders[i].status}</div>
                <div>Order Time: {orders[i].order_time}</div>
                <div>Has Plastic: {orders[i].has_plastic}</div>
                <div>Note: {orders[i].note}</div>
                <div>Total Price: {orders[i].total_price}</div>
                <br></br>
            </div>)
        }
        return it;
    }

    return orders ? (
        <div>
            {renderOrders()}
        </div>) : (
            <span>Loading Orders</span>
        );
}
