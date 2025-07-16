import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight , faArrowLeft} from '@fortawesome/free-solid-svg-icons';


function App() {
  const [form, setForm] = useState({ Name: '', Email: '', Password: '' });
  const [isEmployee, setIsEmployee] = useState(false);
  const [message, setMessage] = useState('');
  const containerRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEmployee ? 'employee' : 'admin';

    try {
      const res = await axios.post(`http://localhost:5000/api/user/login/${endpoint}`, form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.error)
    }
  };

  const switchToAdmin= () => {
    containerRef.current.classList.remove('right-panel-active');
    setIsEmployee(false);
    setMessage('Admin')

  };

  const switchToEmployee = () => {
    containerRef.current.classList.add('right-panel-active');
    setIsEmployee(true);
    setMessage('Employee')
   
  };

  return (
    <>
      <div id="main-container" ref={containerRef}>
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <h2>  Admin Gate </h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="email" placeholder="Email" onChange={handleChange} />
           <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="password" name="secretKey" placeholder="Secret Key" onChange={handleChange} />
            <button type="submit">Sign In</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <h2 className='login-text'>Employee Gate</h2>
          <form  onSubmit={handleSubmit}>
            <input type="text" name="email" placeholder="Email"  onChange={handleChange} />
            <input type="password" name="password" placeholder="Password"   onChange={handleChange}/>
            <button type="submit">Login</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>

        {/* Overlay */}
        <div id="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h2>Employee Dimension </h2>
              <button className="ghost" onClick={switchToEmployee}>{<FontAwesomeIcon icon = {faArrowRight} />}</button>
            </div>
            <div className="overlay-panel overlay-left">
               <h2>Admin Dimension </h2>
              <button className="ghost" onClick={switchToAdmin}>{<FontAwesomeIcon icon = {faArrowLeft} />}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;