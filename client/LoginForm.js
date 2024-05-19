import { useEffect,useState } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({baseURL: "http://127.0.0.1:8000"}); // We will set the API here

const LoginForm = () => {
  const [currentUser, setCurrentUser] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [check, setCheck] = useState('');


  function submitLogin(e){
    e.preventDefault();
    client.post("/api/login", {
      email: email,
      password: password
    }).then(function(res){
      console.log(res);
      setCurrentUser(true);
    }).catch(function(error){
      setCheck("Please check your email/password")
    })
  }

  function submitRegister(e){
    e.preventDefault();
    client.post("/api/register", {
      email: email,
      password: password,
      username: 'test'
    }).then(function(res){
      console.log(res.statusText);
      setCurrentUser(true);
    }).catch(function(error){
      if (error.message === 'Request failed with status code 500') {
        setCheck("Email is already exists")
      }
      else{
        setCheck("Check email syntax")
      }
      console.log(error.message)
    })
  }

  useEffect(() => {
    client.get("/api/user").then(function(res){
      setCurrentUser(true);
    }).catch(function(error){
      setCurrentUser(false);
    })
  }, []);
  
  // if currentUser == true, direct client to Home Page
  if (currentUser) {
    console.log('Done');
    return (<div className='welcome'>
      <h2>Welcome to Neoterz</h2>
    </div>)
  }
  
    return (
    <div className='container'>
      <h2>Login to Neoterz</h2>
      <div className='form'>
      <p>{check}</p>
<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submitLogin}>Login</button>
        <p id='no-account'> or create a new account using above info </p>
        <button onClick={submitRegister}>Register</button>
      </div>
    </div>
  );
};

export default LoginForm;