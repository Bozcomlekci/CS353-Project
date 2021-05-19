import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  creditBox: {
    border: '1px solid black',
    backgroundColor: 'gray',
    width: 'fit-content',
    flexDirection: "row",
    "& p, h3": {
      margin: "0",
      padding: "0"
    },
    height: 'fit-content',
    margin: 'auto 100px',
    padding: '50px',
    fontSize: '28px'
  },
  paper: {
    position: 'absolute',
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

export default function CreditBox(props) {
  const [modalStyle] = useState(getModalStyle);
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [credit, setCredit] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    getCredit().then(res => {
        setCredit(res);
        window.sessionStorage.setItem("credit", res);
    });
  }, []);

  async function getCredit() {
    const userInfo = await axios.get('http://localhost:9000/userInfo', {withCredentials: true});
    console.log(userInfo.data)
    return userInfo.data[1].credit;
  }

  async function addCredit(amount) {
    await axios.get('http://localhost:9000/userInfo/top_up_credit', {params: {
      amount: amount
    }}, {withCredentials: true});
  }

  return credit ?  (<>
  <div className={classes.creditBox}>
        <p>Credit: {credit}TL</p>
        <Button onClick={() => setOpen(true)}>Add Credit</Button>
    </div>
    <Modal
        open={open}
        onClose={(e) => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
        <div style={modalStyle} className={classes.paper}>
          <TextField type="number" value={amount} onChange={(e) => setAmount(Math.max(e.target.value, 0))}/>
          <Button onClick={() => {
                addCredit(amount).then(
                  getCredit().then(res => {
                setCredit(res)}))}} style={{
                  fontSize: '20px'
                }} variant="outlined" color="secondary">Add Credit</Button>
        </div>
    </Modal>
    </>
  ): (<span>Loading Credit Box</span>);
}
