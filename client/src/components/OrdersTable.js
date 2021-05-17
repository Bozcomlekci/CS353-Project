import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';
import { DataGrid } from '@material-ui/data-grid';
import Modal from '@material-ui/core/Modal';
import OptionsTable from './OptionsTable';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    orderableModal: {
        width: 400,
    },
    addItemModal: {
        width: 800,
    }
}));

function getModalStyle() {
    const top = 50;
    const left = 50;
    
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}



export default function OrdersTable(props) {
    const [modalStyle] = useState(getModalStyle);
    const [orders, setOrders] = useState(null);

    
    const columns = [
        { field: 'id', type: 'number',headerName: 'Order ID', width: 100 },
        { field: "status",
        headerName: "Order Status",
        disableClickEventBubbling: true,
        width: 150,
        renderCell: (params) => {
            if (params.row.status == "restaurant_approval") {
                return <Button onClick={()=> {
                    approveOrder(params.row.id);
                    getOrders().then(res => {
                        setOrders(createData(res));
                    });
                }}>Approve</Button>;
            }
            else if (params.row.status == "assign_delivery") {
                return <Button onClick={()=> {
                    requestDelivery(params.row.id);
                    getOrders().then(res => {
                        setOrders(createData(res));
                    });
                }}>Assign Delivery</Button>;
            }
            else if (params.row.status == "request_delivery") {
                return "Requested Delivery";
            }
            else if (params.row.status == "in_delivery") {
                return "In Delivery";
            }
            else {
                return "Delivered";
            }
            }
        },
        { field: 'username', headerName: 'Name', width: 150 },
        { field: 'order_time', headerName: 'Order Time', width: 160 },
        { field: 'time_to_deliver', headerName: 'Time To Deliver', width: 160 },
        { field: 'has_plastic', headerName: 'Has Plastic', width: 140 },
        { field: 'note', headerName: 'Note', width: 120 },
        { field: 'total_price', headerName: 'Price', width: 120 },
        /*
        
        */
    ];
    
    const classes = useStyles();
    function createData(orders) {
        let it = [];
        console.log(orders);
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i];
            let newItem = {
                id: order.order_id,
                status: order.status,
                username: order.username,
                order_time: order.order_time,
                time_to_deliver: order.time_to_deliver,
                has_plastic: order.has_plastic,
                note: order.note,
                total_price: order.total_price
            };
            it.push(newItem);
        }
        return it;
    }

    useEffect(() => {
        getOrders().then(res => {
            setOrders(createData(res));
        });
    }, []);

    async function approveOrder(order_id) {
        console.log(order_id);
        await axios.get('http://localhost:9000/order/approve', {params: {
            order_id: order_id
        }},{withCredentials: true});
    }

    async function requestDelivery(order_id) {
        await axios.get('http://localhost:9000/order/request_delivery', {params: {
            order_id: order_id
        }},{withCredentials: true});
    }

    async function getOrders() {
        const orders = await axios.get('http://localhost:9000/order/restaurant', {withCredentials: true});
        return orders.data;
    }

    return orders ?  (
        <>
        <div>
            <Button onClick={()=>getOrders().then(res => {
            setOrders(createData(res))})}>Refresh</Button>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={orders} columns={columns} pageSize={8}/>
            </div>
        </div>
    </>
      ): (<span>Loading Table</span>);
}
