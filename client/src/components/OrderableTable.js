import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';
import { DataGrid } from '@material-ui/data-grid';


const useStyles = makeStyles((theme) => ({
}));

const columns = [
    { field: 'id', type: 'number', headerName: 'Orderable No', width: 120 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'discount', type: 'number', headerName: 'Discount', width: 200 },
    { field: 'price', type: 'number', headerName: 'Price', width: 130 },
    { field: 'instock', headerName: 'Item Type', width: 120 }
  ];

  
export default function OrderableTable(props) {
    const [orderables, setOrderables] = useState(null);
    const [searchValue, setSearchValue] = useState("");
      
    function createData(orderables) {
        console.log(orderables);
        let it = [];
        for (let i = 0; i < orderables.length; i++) {
            let newOrderable = {
                id: i+1,
                name: orderables[i].orderable_name,
                discount: orderables[i].discount,
                price: orderables[i].price,
                instock: orderables[i].instock
            };
            it.push(newOrderable);
        }
        return it;
    }

    useEffect(() => {
        getOrderables().then(res => {
            setOrderables(createData(res));
        });
    }, []);
        
    async function getOrderables(searchVal) {
        const orderables = await axios.get('http://localhost:9000/restaurant/list_orderables', {
        params: {
            restaurant_id: props.restaurant.restaurant_id,
            in_name: searchVal
        }, withCredentials: true});
        return orderables.data;
    }

    //setItems(createData(getItems(searchValue)))
    return orderables ?  (
        <div>
            <TextField id="outlined-search" label="Search field" type="search" variant="outlined" placeholder="Search Orderables" onChange={(e) => setSearchValue(e.target.value)}/>
            <Button onClick={()=>getOrderables(searchValue).then(res => {
            setOrderables(createData(res))})}>Search</Button>
            <div style={{ height: 400, width: '50%' }}>
            <DataGrid rows={orderables} columns={columns} pageSize={4}/>
            </div>
        </div>
      ): (<span>Loading Table</span>);
}
