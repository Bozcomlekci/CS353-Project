import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const useStyles = makeStyles((theme) => ({
 signupBox: {
    margin: '0 auto',

    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid black',
    width: 'fit-content'
  },
  signupText: {
    fontSize: '32px',
    textAlign: 'center'
  },
  titleText: {
    fontSize: '32px',
    textAlign: 'left',
    color : 'white'
  },
  form: {
    '& > *': {
    
      
      margin: theme.spacing(1),
      width: '25ch',
      display: 'flex',
    },

   },

}));

export default function Signup(props) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let onSignup = props.onSignup;
  
    const sess = await axios.post('http://localhost:9000/signup', {
      username: event.target.username.value,
      first_name: event.target.firstname.value,
      last_name: event.target.lastname.value,
      email: event.target.email.value, 
      password: event.target.password.value,
      birthdate: event.target.date.value,
      type: event.target.type.value,
    }, {withCredentials: true});
    /*
    .then((res) => {
      return res.data.loggedIn;
    }, (err) => {
      console.error(err);
      return false;
    });
    */
    
    /*onSignup(sess.data);*/
  }

  const classes = useStyles();

  return (
    <div>
      <div  style={{
        backgroundColor: '#f50057',
        width: '100%',
        height: '10%',
        }}>
          <p style={{
            textAlign: 'center',
            margin: '0 0 50px 0'
          }} className={classes.titleText}>YEMEK KUTUSU</p>
        </div>
      <div className={classes.signupBox}>
        
          <p className={classes.signupText}>Signup</p>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField required id="outlined-basic" label="Username" name="username" variant="outlined" placeholder="Username"/>
            <TextField required id="outlined-basic" label="First Name" name="firstname" variant="outlined" placeholder="First Name"/>
            <TextField required id="outlined-basic" label="Last Name" name="lastname" variant="outlined" placeholder="Last Name"/>
            <TextField required id="outlined-basic" label="Email" name="email" variant="outlined" placeholder="Email"/>
            <TextField
            id="date"
            label="Birthday"
            type="date"
            defaultValue="2017-05-24"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
            <TextField required id="outlined-basic" label="Password" name="password" type="password" variant="outlined" placeholder="Password"/>
            <TextField required id="outlined-basic" label="Confirm Password" name="confirmPassword" type="password" variant="outlined" placeholder="Confirm Password"/>


            <FormLabel component="legend">Type</FormLabel>
                <RadioGroup aria-label="type" name="type">
                    <FormControlLabel value="Customer" control={<Radio />} label="Customer" />
                    <FormControlLabel value="RestaurantOwner" control={<Radio />} label="Restaurant Owner" />
                    <FormControlLabel value="DeliveryPerson" control={<Radio />} label="Driver" />
                    <FormControlLabel value="SupportStaff" control={<Radio />} label="Support" />
                </RadioGroup>
        
            <Button color="secondary" variant="contained" type="submit">SIGNUP</Button>
          </form>
        </div>
    
    </div>
  );
}
