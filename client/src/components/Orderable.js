import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    orderable: {
        display: 'flex',
        flexDirection: 'column'
    },
    orderableInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orderableItems: {

    },
    paper: {
      margin: "10px",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    absolutePos: {
      position: 'absolute',
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


export default function Orderable(props) {
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [selected, setSelected] = React.useState(Array(props.orderable.items.length).fill('None'));

  const handleOpen = () => {
    console.log(15455454);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    console.log(event);
    console.log();
    let newSelected = selected;
    for (let i = 0; i < props.orderable.items.length; i++) {
      if (props.orderable.items[i].name == event.target.attributes['1'].nodeValue) {
        newSelected[i] = event.target.value;
        setSelected(newSelected);
        break;
      }
    }
    console.log(selected);
  }

  const classes = useStyles();

  function getMenuItemNamesAndQuantity() {
    let result = "";
    for (let i = 0; i < props.orderable.items.length; i++) {
        result += props.orderable.items[i].quantity + " " + props.orderable.items[i].name;
        if (i !== props.orderable.items.length - 1) {
            result += ", ";
        }
    }
    console.log(result);
    return result;
  }

  async function addOrderableToBox() {
    setOpen(false);
    console.log(props.orderable);
    let orderable = {
      restaurant_id: props.restaurant_id,
      orderable_name: props.orderable.orderable_name,
      quantity: quantity,
      options: selected
    };
    await axios.post('http://localhost:9000/box/add', {
      orderable
    }, {withCredentials: true});
    /*const sess = await axios.post('http://localhost:9000/box/add', {
      orderable
    }, {withCredentials: true})
    .then((res) => {
      console.log(res);
    }, (err) => {
      console.error(err);
    });
    */

  }
  

  function optionButtons(item) {
    let options = [];
    options.push(<FormControlLabel value='None' control={<Radio/>} label='Normal' />)
    for (let i = 0; i < item.options.length; i++) {
      let option = item.options[i];
      options.push(<FormControlLabel value={option} control={<Radio/>} label={option} />)
    }
    return options
  }

  function items() {
    let items = [];
    console.log("LERLERLERLELRE", props.orderable.items);
    for (let i = 0; i < props.orderable.items.length; i++) {
      let item = props.orderable.items[i];
      items.push(<FormLabel component="legend">{item.name}</FormLabel>);
      items.push(<RadioGroup defaultValue='None' aria-label={item.name} name={item.name} onChange={handleChange}>{optionButtons(item)}</RadioGroup>);
    }
    return items;
  }

  const body = (
    <div style={modalStyle} className={`${classes.paper} ${classes.absolutePos}`}>
      <h2 id="simple-modal-title">{props.orderable.orderable_name}</h2>
      <p id="simple-modal-description">
        Item, options, quantity.
      </p>
      <FormControl component="fieldset">
        {items()}
      </FormControl>
      <TextField type="number" value={quantity} onChange={(e) => setQuantity(Math.max(e.target.value,0))}/>
      <Button onClick={() => addOrderableToBox()}>ADD TO BOX</Button>
      <Button onClick={() => handleClose()}>CLOSE</Button>
    </div>
  );

  return (
    <>
      <div className={classes.orderable}>
          <Paper className={classes.paper} elevation={3} color='blue'>
          <div className={classes.orderableInfo}>
                <Typography variant="h6">
                  {props.orderable.orderable_name}
                </Typography>
                <Typography variant="h6">
                  {props.orderable.price} TL
                </Typography>              
              
          </div>
          <div className={classes.orderableItems}>
              {getMenuItemNamesAndQuantity()}
          </div>
          <Button onClick={() => handleOpen() } color="primary" >ADD TO BOX</Button>
          </Paper>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
}
