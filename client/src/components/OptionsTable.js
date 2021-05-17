import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import OrderableList from './OrderableList';
import { DataGrid } from '@material-ui/data-grid';
import Modal from '@material-ui/core/Modal';

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



export default function OptionsTable(props) {
    const [modalStyle] = useState(getModalStyle);
    const [items, setItems] = useState(null);
    const [itemId, setItemId] = useState(0);
    const [openQuantity, setOpenQuantity] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [openOptions, setOpenOptions] = useState(false);
    const [itemQuantity, setItemQuantity] = useState(1);

    
    const columns = [
        //{ field: 'id', type: 'number',headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Option', width: 200 },
        { field: 'have_option', headerName: 'Have Option?', width: 150 },
        { field: "Add / Remove",
        headerName: "Add / Remove",
        width: 200,
        disableClickEventBubbling: true,
        renderCell: (params) => {
            if (params.row.have_option) {
                    return <Button onClick={()=> {
                    removeOptionFromItem(params.row.name).then(
                    getOptions().then(res => {
                        setItems(createData(res));
                    }));
                    //setItemId(params.row.id);
                    //setOpenQuantity(true);
                }}>Remove</Button>
            }
            else {
                return <Button onClick={()=> {
                    addOptionToItem(params.row.name).then(
                    getOptions().then(res => {
                        setItems(createData(res));
                    }));
                    //setItemId(params.row.id);
                    //setItemId(params.row.id);
                    //setOpenQuantity(true);
                }}>Add</Button>
            }
            }
        }
    ];
    
    const classes = useStyles();
    function createData(options) {
        console.log(options, 'options');
        let it = [];
        for (let i = 0; i < options.length; i++) {
            let newItem = {
                id: i,
                name: options[i].name,
                have_option: options[i].have_option
            };
            it.push(newItem);
        }
        return it;
    }

    useEffect(() => {
        getOptions().then(res => {
            setItems(createData(res));
        });
    }, []);

    async function getOptions(searchVal) {
        console.log("ITEMID: ", props.orderable)
        const options = await axios.get('http://localhost:9000/restaurant/get_options_for_item', {
        params: {
            item_id: props.item_id,
            in_name: searchVal
        }, withCredentials: true});
        return options.data;
    }

    async function removeOptionFromItem(name) {
        console.log(name);
        await axios.post('http://localhost:9000/restaurant/remove_option_from_item', {
            option_name: name,
            item_id: props.item_id
        },{withCredentials: true});
    }

    async function addOptionToItem(name) {
        await axios.post('http://localhost:9000/restaurant/add_option_to_item', {
            option_name: name,
            item_id: props.item_id
        },{withCredentials: true});
        
    }

    async function setOrderableItemQuantity() {
        /*
        console.log(props.orderable, 'asdasdas');
        const items = await axios.post('http://localhost:9000/restaurant/set_orderable_item_quantity', {
            quantity: itemQuantity,
            orderable_name: props.orderable.orderable_name,
            item_id: itemId
        },{withCredentials: true});
        */
    }

    return items ?  (
        <>
        <div>
            <TextField id="outlined-search" label="Search field" type="search" variant="outlined" placeholder="Search Items" onChange={(e) => setSearchValue(e.target.value)}/>
            <Button onClick={()=>getOptions(searchValue).then(res => {
            setItems(createData(res))})}>Search</Button>
            <Button onClick={()=>getOptions().then(res => {
            setItems(createData(res))})}>Refresh</Button>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={items} columns={columns} pageSize={8}/>
            </div>
        </div>
    </>
      ): (<span>Loading Table</span>);
}
