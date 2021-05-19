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



export default function DeliveryTable(props) {
    const [modalStyle] = useState(getModalStyle);
    const [requests, setRequests] = useState(null);
    const [acceptedRequest, setAcceptedRequest] = useState(null);

    
    const columns = [
        { field: 'id', type: 'number',headerName: 'Order ID', width: 100 },
        { field: "accept",
        headerName: "Accept",
        disableClickEventBubbling: true,
        width: 150,
        renderCell: (params) => {
                return <Button onClick={()=> {
                    /*
                    approveOrder(params.row.id);
                    getOrders().then(res => {
                        setOrders(createData(res));
                    });
                    */
                    respondToDeliveryRequest(true, params.row.id);
                }}>Accept</Button>;
        },},
        { field: "reject",
        headerName: "Reject",
        disableClickEventBubbling: true,
        width: 150,
        renderCell: (params) => {
                return <Button onClick={()=> {
                    /*
                    approveOrder(params.row.id);
                    getOrders().then(res => {
                        setOrders(createData(res));
                    });
                    */
                    respondToDeliveryRequest(false, params.row.id);
                }}>Reject</Button>;
        },},
        { field: 'street', headerName: 'street', width: 150 },
        { field: 'street_number', headerName: 'street_number', width: 160 },
        { field: 'street_name', headerName: 'street_name', width: 160 },
        { field: 'apt_number', headerName: 'apt_number', width: 140 },
        { field: 'city', headerName: 'city', width: 120 },
        { field: 'county', headerName: 'county', width: 120 },
        { field: 'zip', headerName: 'zip', width: 120 },
    ];
    
    const classes = useStyles();
    function createData(orders) {
        let it = [];
        console.log(orders);
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i];
            let newItem = {
                id: order.order_id,
                street: order.street,
                street_number: order.username,
                street_name: order.street_name,
                apt_number: order.apt_number,
                city: order.city,
                county: order.county,
                zip: order.zip,
                acceptance: order.acceptance,
                status: order.status
            };
            if (newItem.acceptance == true && newItem.status == 'in_delivery') {
                it = [];
                it.push(newItem);
                setAcceptedRequest(true);
                break;
            }
            it.push(newItem);
        }
        console.log(it, "ITIT");
        return it;
    }

    useEffect(() => {
        getRequests().then(res => {
            setRequests(createData(res));
        });
    }, []);

    async function getRequests() {
        const requests = await axios.get('http://localhost:9000/order/get_delivery_requests', {withCredentials: true});
        return requests.data;
    }

    async function respondToDeliveryRequest(accept, order_id) {
        await axios.get('http://localhost:9000/order/respond_to_delivery', {
            params: {
                accept: accept,
                order_id: order_id
            }, withCredentials: true});
    }

    async function completeDelivery(order_id) {
        console.log(order_id, "IDDDD");
        await axios.get('http://localhost:9000/order/complete_delivery', {
            params: {
                order_id: order_id
            }, withCredentials: true});
    }

    return requests ? acceptedRequest ? 
    <div style={{
        margin: '20px',
        width: 'fit-content'
    }}>
        <h2>On delivery to address:</h2>
        <div>{requests[0].street}</div>
        <div>Street/Apt Number: {requests[0].street_number}/{requests[0].apt_number}</div>
        <div>{requests[0].city}</div>
        <div>{requests[0].county}</div>
        <div>{requests[0].zip}</div>
        <div>{requests[0].acceptance}</div>
        <Button onClick={() => completeDelivery(requests[0].id)}>Complete Delivery</Button>
    </div> 
    : (
        <>
        <div>
            <Button onClick={()=>getRequests().then(res => {
            setRequests(createData(res))})}>Refresh</Button>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={requests} columns={columns} pageSize={8}/>
            </div>
        </div>
    </>
      ): (<span>Loading Table</span>);
}
