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



export default function OrderableItemsTable(props) {
    const [modalStyle] = useState(getModalStyle);
    const [items, setItems] = useState(null);
    const [itemId, setItemId] = useState(0);
    const [openQuantity, setOpenQuantity] = useState(false);
    const [openOptions, setOpenOptions] = useState(false);
    const [itemQuantity, setItemQuantity] = useState(1);

    
    const columns = [
        { field: 'id', type: 'number',headerName: 'Item ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'content', headerName: 'Content', width: 200 },
        { field: 'size', headerName: 'Size', width: 130 },
        { field: 'itemtype', headerName: 'Item Type', width: 120 },
        { field: 'quantity', headerName: 'Quantity', width: 120 },
        { field: "Change QTY",
        headerName: "Change Qty.",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return <Button onClick={()=> {
                //setItemId(params.row.id);
                setItemId(params.row.id);
                setOpenQuantity(true);
            }}>Change Qty.</Button>
            }
        },
        { field: "Options",
        headerName: "Options",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return <Button onClick={()=> {
                setItemId(params.row.id);
                //setOldItemQuantity(itemQuantity);
                setOpenOptions(true);
            }}>Options</Button>
            }
        }
    ];
    
    const classes = useStyles();
    function createData(items) {
        console.log(items);
        let it = [];
        for (let i = 0; i < items.length; i++) {
            let newItem = {
                id: items[i].item_id,
                name: items[i].name,
                content: items[i].content,
                size: items[i].size,
                quantity: items[i].quantity,
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
        const items = await axios.get('http://localhost:9000/restaurant/get_items_of_orderable', {
        params: {
            orderable_name: props.orderable.orderable_name
        }, withCredentials: true});
        return items.data;
    }


    async function setOrderableItemQuantity() {
        console.log(props.orderable, 'asdasdas');
        const items = await axios.post('http://localhost:9000/restaurant/set_orderable_item_quantity', {
            quantity: itemQuantity,
            orderable_name: props.orderable.orderable_name,
            item_id: itemId
        },{withCredentials: true});
    }

    return items ?  (
        <>
        <div>
            <Button onClick={()=>getItems().then(res => {
            setItems(createData(res))})}>Refresh</Button>
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={items} columns={columns} pageSize={8}/>
            </div>
        </div>
        <Modal
        open={openQuantity}
        onClose={(e) => setOpenQuantity(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
            <div style={modalStyle} className={`${classes.paper} ${classes.addItemModal}`}>
                Quantity?
                <TextField id="outlined-search" label="Item Quantity To Add" type="number" variant="outlined" placeholder="Item Quantity To Add" value={itemQuantity} onChange={(e) => setItemQuantity(Math.max(0, e.target.value))}/>
                <Button onClick={() => setOrderableItemQuantity()}>Change Quantity</Button>
            </div>
        </Modal>
        <Modal
        open={openOptions}
        onClose={(e) => setOpenOptions(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
            <div style={modalStyle} className={`${classes.paper} ${classes.addItemModal}`}>
                <OptionsTable orderable={props.orderable} item_id={itemId}/>
            </div>
        </Modal>
    </>
      ): (<span>Loading Table</span>);
}
