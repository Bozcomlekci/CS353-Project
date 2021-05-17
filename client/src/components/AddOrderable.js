import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';
import { DataGrid } from '@material-ui/data-grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles((theme) => ({
}));
  
export default function AddOrderable(props) {
    const [name, setName] = useState("");
    const [discount, setDiscount] = useState(0.0);
    const [price, setPrice] = useState(0.0);
    const [inStock, setInStock] = useState(true);
    

    async function addOrderable() {
        await axios.post('http://localhost:9000/restaurant/add_orderable', {
            orderable_name: name,
            discount: discount,
            price: price,
            instock: inStock,
        }, {withCredentials: true});
    }

    //setItems(createData(getItems(searchValue)))
    return (
        <div>
            <TextField id="name" label="Orderable Name" variant="outlined" placeholder="Orderable Name" onChange={(e) => setName(e.target.value)}/>
            <TextField id="discount" label="Orderable Discount" variant="outlined" placeholder="Orderable Discount" onChange={(e) => setDiscount(e.target.value)}/>
            <TextField id="price" label="Orderable Price" variant="outlined" placeholder="Orderable Price" onChange={(e) => setPrice(e.target.value)}/>
            <Select
                labelId="type-label"
                id="type"
                value={inStock}
                onChange={(e) => setInStock(e.target.value)}
                >
                <MenuItem value={true}>In Stock</MenuItem>
                <MenuItem value={false}>Not In Stock</MenuItem>
            </Select>
            <Button onClick={()=>addOrderable()}>Add Orderable</Button>
        </div>);
}
