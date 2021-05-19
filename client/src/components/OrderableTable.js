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
import Modal from '@material-ui/core/Modal';
import ItemTable from './ItemTable';
import AddItem from './AddItem';
import OrderableItemsTable from './OrderableItemsTable';

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


export default function OrderableTable(props) {
    const [modalStyle] = useState(getModalStyle);
    const [orderables, setOrderables] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [open, setOpen] = useState(false);
    const [openAddItem, setOpenAddItem] = useState(false);
    const [orderable_name, setOrderable_name] = useState("");
    const [orderable, setOrderable] = useState(null);
    const [price, setPrice] = useState(0.0);
    const [discount, setDiscount] = useState(0.0);
    const [inStock, setInStock] = useState(false);

    const classes = useStyles();
    
    const columns = [
        { field: 'id', type: 'number', headerName: 'Orderable No', width: 120 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'discount', type: 'number', headerName: 'Discount', width: 200 },
        { field: 'price', type: 'number', headerName: 'Price', width: 130 },
        { field: 'instock', headerName: 'In Stock', width: 120 },
        {field: "",
            headerName: "Edit Orderable",
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return <Button onClick={()=> {
                    setOrderable(params.row.orderable)
                    setOrderable_name(params.row.name);
                    setPrice(params.row.price);
                    setDiscount(params.row.discount);
                    setInStock(params.row.instock);
                    setOpen(true);
                }}>Edit</Button>
            }
        }
    ];
    
    useEffect(() => {
        updateTable();
    }, []);

    async function updateTable() {
        getOrderables().then(res => {
            setOrderables(createData(res));
        });
        setOrderable(orderable);
    }

    async function updateOrderable() {
        await axios.post('http://localhost:9000/restaurant/update_orderable', {
            orderable_name: orderable_name,
            discount: discount,
            price: price,
            instock: inStock
        }, {withCredentials: true});
    }

    async function deleteOrderable() {
        await axios.post('http://localhost:9000/restaurant/remove_orderable', {
            orderable_name: orderable_name
        }, {withCredentials: true});
    }

    function createData(orderables) {
        console.log(orderables);
        let it = [];
        for (let i = 0; i < orderables.length; i++) {
            let newOrderable = {
                id: i+1,
                name: orderables[i].orderable_name,
                discount: orderables[i].discount,
                price: orderables[i].price,
                instock: orderables[i].instock,
                orderable: orderables[i]
            };
            it.push(newOrderable);
        }
        return it;
    }
        
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
        <>
        <div>
            <TextField id="outlined-search" label="Search field" type="search" variant="outlined" placeholder="Search Orderables" onChange={(e) => setSearchValue(e.target.value)}/>
            <Button onClick={()=>getOrderables(searchValue).then(res => {
            setOrderables(createData(res))})}>Search</Button>
            <Button onClick={()=>getOrderables().then(res => {
            setOrderables(createData(res))})}>Refresh</Button>
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={orderables} columns={columns} pageSize={5}/>
            </div>
        </div>

      <Modal
        open={open}
        onClose={(e) => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">{orderable_name}</h2>
            <p id="simple-modal-description">
                Item, options, quantity.
            </p>
            <OrderableItemsTable orderable={orderable}/>
            <TextField type="number" value={discount} onChange={(e) => setDiscount(Math.max(e.target.value, 0))}/>
            <TextField type="number" value={price} onChange={(e) => setPrice(Math.max(e.target.value, 0))}/>
            <Select
                labelId="type-label"
                id="type"
                value={inStock}
                onChange={(e) => setInStock(e.target.value)}
                >
                <MenuItem value={true}>In Stock</MenuItem>
                <MenuItem value={false}>Not In Stock</MenuItem>
            </Select>
            <Button onClick={() => {
                updateOrderable().then(getOrderables().then(res => {
                    setOrderables(createData(res));
                }));
            }}>Save</Button>
            <Button onClick={() => {
                deleteOrderable().then(getOrderables().then(res => {
                    setOrderables(createData(res));
                }));
            }}>Delete</Button>
            <Button onClick={() => setOpenAddItem(true)}>Add Item To Orderable</Button>
        </div>
      </Modal>
    <Modal
        open={openAddItem}
        onClose={(e) => setOpenAddItem(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
        <div style={modalStyle} className={`${classes.paper} ${classes.addItemModal}`}>
            ASDASDASDASDAS
            <ItemTable restaurant_id={props.restaurant.restaurant_id} orderable_name={orderable_name}/>
            <AddItem/>
        </div>
    </Modal>
      </>
      ): (<span>Loading Table</span>);
}
