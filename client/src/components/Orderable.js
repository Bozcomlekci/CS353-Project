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

const useStyles = makeStyles((theme) => ({
    orderable: {
        display: 'flex',
        flexDirection: 'column'
    },
    orderableInfo: {
        display: 'flex',
        flexDirection: 'row',
    },
    orderableItems: {

    },
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
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

  const handleOpen = () => {
    console.log(15455454);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  function getMenuItemNamesAndQuantity() {
    let result = "";
    for (let i = 0; i < props.orderable.items.length; i++) {
        result += props.orderable.items[i].quantity + " " + props.orderable.items[i].name;
        if (i !== props.orderable.items.length - 1) {
            result += ", ";
        }
    }
    return result;
  }

  function addOrderableToBox() {
    alert("ADD TO BOX HERE IN THE CODE");
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">{props.orderable.orderable_name}</h2>
      <p id="simple-modal-description">
        Item, options, quantity.
      </p>
      <FormControl component="fieldset">
        <RadioGroup aria-label="gender" name="gender1">
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
      <Button onClick={() => addOrderableToBox()}>ADD TO BOX</Button>
      <Button onClick={() => handleClose()}>CLOSE</Button>
    </div>
  );

  return (
    <>
      <div className={classes.orderable}>
          <div className={classes.orderableInfo}>
              <Button onClick={() => handleOpen()}>ADD TO BOX</Button>
              <div>{props.orderable.orderable_name}</div>
              <div>{props.orderable.price}</div>
          </div>
          <div className={classes.orderableItems}>
              {getMenuItemNamesAndQuantity()}
          </div>
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
