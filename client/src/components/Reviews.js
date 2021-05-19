import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';

const useStyles = makeStyles((theme) => ({
    review: {
        border: '1px solid black',
        padding: '10px'
    }
}));

export default function Reviews(props) {
    const [reviews, setReviews] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        getReviews().then(res => {
            setReviews(res);
        });
      }, []);

    async function getReviews() {
        const reviews = await axios.get('http://localhost:9000/review/list', {
        params: {
            restaurant_id: props.restaurant_id,
        }, withCredentials: true});
        console.log(reviews.data);
        return reviews.data;
      }

    function renderReviews() {
        let it = [];
        for (let i = 0; i < reviews.length; i++) {
            it.push(<div className={classes.review}>
                <div>Restaurant Rating: {reviews[i].restaurant_rating}</div>
                <div>Delivery Rating: {reviews[i].delivery_rating}</div>
                <div>Restaurant Comment:: {reviews[i].restaurant_comment}</div>
                <div>Delivery Comment:: {reviews[i].delivery_comment}</div>
                {reviews[i].restaurant_response ? <div>Restaurant Response: {reviews[i].restaurant_response}</div> : <div></div>}
            </div>)
        }
        return it;
    }

    return reviews ? (
        <div>
            <h2>Reviews</h2>
            {renderReviews()}
        </div>) : (
            <span>Loading Reviews</span>
        );
}
