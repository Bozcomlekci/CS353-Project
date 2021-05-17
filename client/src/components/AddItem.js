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


const useStyles = makeStyles((theme) => ({
}));
  
export default function AddItem(props) {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [size, setSize] = useState("");
    const [type, setType] = useState("food");
    

    async function addItem() {
        await axios.post('http://localhost:9000/restaurant/add_item', {
            name: name,
            content: content,
            size: size,
            itemtype: type,
        }, {withCredentials: true});
    }

    //setItems(createData(getItems(searchValue)))
    return (
        <div>
            <TextField id="name" label="Item Name" variant="outlined" placeholder="Item Name" onChange={(e) => setName(e.target.value)}/>
            <TextField id="content" label="Item Contents" variant="outlined" placeholder="Item Contents" onChange={(e) => setContent(e.target.value)}/>
            <TextField id="size" label="Item Size" variant="outlined" placeholder="Item Size" onChange={(e) => setSize(e.target.value)}/>
            <Select
                labelId="type-label"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                >
                <MenuItem value={"food"}>food</MenuItem>
                <MenuItem value={"beverage"}>beverage</MenuItem>
            </Select>
            <Button onClick={()=>addItem()}>Add Item To Database</Button>
            
        </div>);
}
