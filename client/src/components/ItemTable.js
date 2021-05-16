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
    { field: 'id', type: 'number',headerName: 'Item ID', width: 120 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'content', headerName: 'Content', width: 200 },
    { field: 'size', headerName: 'Size', width: 130 },
    { field: 'itemtype', headerName: 'Item Type', width: 120 }
  ];

  
export default function ItemTable(props) {
    const [items, setItems] = useState(null);
    const [searchValue, setSearchValue] = useState("");
      
    function createData(items) {
        console.log(items);
        let it = [];
        for (let i = 0; i < items.length; i++) {
            let newItem = {
                id: items[i].item_id,
                name: items[i].name,
                content: items[i].content,
                size: items[i].size,
                itemtype: items[i].itemtype
            };
            it.push(newItem);
        }
        return it;
    }

    useEffect(() => {
        getItems().then(res => {
            setItems(createData(res));
        });
    }, []);
        
    async function getItems(searchVal) {
        const items = await axios.get('http://localhost:9000/restaurant/list_items', {
        params: {
            in_name: searchVal
        }, withCredentials: true});
        return items.data;
    }

    //setItems(createData(getItems(searchValue)))
    return items ?  (
        <div>
            <TextField id="outlined-search" label="Search field" type="search" variant="outlined" placeholder="Search Items" onChange={(e) => setSearchValue(e.target.value)}/>
            <Button onClick={()=>getItems(searchValue).then(res => {
            setItems(createData(res))})}>Search</Button>
            <div style={{ height: 400, width: '50%' }}>
            <DataGrid rows={items} columns={columns} pageSize={4}/>
            </div>
        </div>
      ): (<span>Loading Table</span>);
}
