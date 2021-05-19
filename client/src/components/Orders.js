import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import OrderableList from './OrderableList';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    orderableModal: {
        width: 400,
    },
    addItemModal: {
        width: 800,
    },
    order: {
        padding: '25px',
        margin: '25px',
        border: '1px solid black',
        width: 'fit-content'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row'
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

export default function Orders(props) {
    const [modalStyle] = useState(getModalStyle);
    const [orders, setOrders] = useState(null);
    const [notReviewed, setNotReviewed] = useState(null);
    const [reviewedOrderId, setReviewedOrderId] = useState(0);
    const [openReview, setOpenReview] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
    const [supportOrderId, setSupportOrderId] = useState(0);
    const [restaurantRating, setRestaurantRating] = useState(5);
    const [deliveryRating, setDeliveryRating] = useState(5);
    const [restaurantComment, setRestaurantComment] = useState("");
    const [deliveryComment, setDeliveryComment] = useState("");
    const [ticketContent, setTicketContent] = useState("");
    const [ticketSubject, setTicketSubject] = useState("");
    const classes = useStyles();

    useEffect(() => {
        getNotReviewed().then(res => {
            setNotReviewed(res);
        });
        getOrders().then(res => {
            setOrders(res);
        });
      }, []);

    async function getNotReviewed() {
        console.log("DEEEEEEEEEEEEEBUG");
        const nr = await axios.get('http://localhost:9000/order/getNotReviewed', {withCredentials: true});
        console.log(nr.data, "NR");
        return nr.data;
    }

    async function getOrders() {
        console.log("DEEEEEEEEEEEEEBUG");
        const orders = await axios.get('http://localhost:9000/order/customer', {withCredentials: true});
        console.log(orders.data);
        return orders.data;
      }

    function review(id) {
        setReviewedOrderId(id);
        setOpenReview(true);
    }

    async function submitReview() {
        await axios.post('http://localhost:9000/review/write', {
            restaurantComment: restaurantComment,
            deliveryComment: deliveryComment,
            restaurantRating: restaurantRating,
            driverRating: deliveryRating,
            order_id: reviewedOrderId
        }, {withCredentials: true});
    }

    function support(id) {
        setSupportOrderId(id);
        setOpenSupport(true);
    }

    async function submitTicket() {
        await axios.post('http://localhost:9000/support/writeticket', {
            date: (new Date()).toISOString().substring(0,16),
            is_food: true,
            subject: ticketSubject,
            content: ticketContent,
            order_id: supportOrderId
        }, {withCredentials: true});
    }

    function statusText(status) {
        if (status == 'restaurant_approval') {
            return 'Waitin for restaurant approval'
        }
    }

    function plastic(yN) {
        if (yN == true) {
            return 'Yes';
        }
        else {
            return 'No';
        }
    }

    function orderablesRepr(orderables) {
        let s = "";
        for (let i = 0; i < orderables.length; i++) {
            s += orderables[i].quantity + " " + orderables[i].orderable_name;
            if (i != orderables.length -1) {
                s += ", ";
            }
        }
        return s;
    }

    function renderOrders() {
        let it = [];
        console.log(orders);
        for (let i = 0; i < orders.length; i++) {
            it.push(<div className={classes.order}>
                <div>Restaurant Name: {orders[i].name}</div>
                <div>Status: {statusText(orders[i].status)}</div>
                <div>Order Time: {orders[i].order_time.substring(0,10) + ' ' + orders[i].order_time.substring(11,16)}</div>
                <div>Has Plastic: {plastic(orders[i].has_plastic)}</div>
                <div>Note: {orders[i].note}</div>
                <div>Total Price: {orders[i].total_price}</div>
                <div>Contents: {orderablesRepr(orders[i].orderables)}</div>
                <br></br>
                <div className={classes.buttons}>
                    {notReviewed.filter(nr => nr.order_id == orders[i].order_id).length == 1 ? <Button onClick={() => review(orders[i].order_id)}>Review</Button> : <></>}
                    <Button onClick={() => support(orders[i].order_id) } style={{
                        backgroundColor: '#F50057',
                    }}>Support Ticket</Button>
                </div>
            </div>)
        }
        return it;
    }

    return orders ? (
        <>
        <div>
            {renderOrders()}
        </div>
        <Modal
        open={openReview}
        onClose={(e) => setOpenReview(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
            <div style={modalStyle} className={`${classes.paper} ${classes.addItemModal}`}>
            <TextField id="outlined-search" label="Restaurant Comment" type="text" variant="outlined" placeholder="Restaurant Comment" value={restaurantComment} onChange={(e) => setRestaurantComment(e.target.value)}/>
            <TextField id="outlined-search" label="Delivery Comment" type="text" variant="outlined" placeholder="Delivery Comment" value={deliveryComment} onChange={(e) => setDeliveryComment(e.target.value)}/>
            <div>
            Restaurant Rating:
            <Select
                labelId="type-label"
                id="restaurantRating"
                value={restaurantRating}
                onChange={(e) => setRestaurantRating(e.target.value)}
                >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
            </Select>
            Delivery Rating:
            <Select
                labelId="type-label"
                id="deliveryRating"
                value={deliveryRating}
                onChange={(e) => setDeliveryRating(e.target.value)}
                >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
            </Select>
            </div>
            <Button onClick={()=>submitReview()}>Submit Review</Button>
            </div>
        </Modal>
        <Modal
        open={openSupport}
        onClose={(e) => setOpenSupport(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
            <div style={modalStyle} className={`${classes.paper} ${classes.addItemModal}`}>
            <TextField id="outlined-search" label="Subject" type="text" variant="outlined" placeholder="Subject" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)}/>
            <TextField id="outlined-search" label="Content" type="text" variant="outlined" placeholder="Content" value={ticketContent} onChange={(e) => setTicketContent(e.target.value)}/>
            <Button onClick={()=>submitTicket()}>Submit Ticket</Button>
            </div>
        </Modal>
        </>) : (
            <span>Loading Orders</span>
        );
}
