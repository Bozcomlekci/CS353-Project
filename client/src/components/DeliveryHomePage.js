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
import DeliveryTable from './DeliveryTable';


const useStyles = makeStyles((theme) => ({
}));

export default function DeliveryHomePage(props) {
    return ( <div>
        <h1>Welcome, {props.user.username}</h1>
        <h3>Delivery Request Table</h3>
        <div style={{
            border: '1px black solid',
            margin: '10px'
        }}>
            <DeliveryTable/>
        </div>
    </div>);
  
}
