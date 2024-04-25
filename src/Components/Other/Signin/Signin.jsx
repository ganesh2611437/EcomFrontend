import React from "react";
import "./Signin.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { appContext } from '../../../App';
import { BASE_URL } from "../../../Helper";
function Signin() {
  const {SetLoading, SetCurrentUser} = useContext(appContext);
  const Navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    SetLoading(true);
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/user/login`, {
        ...userDetails
      });
      if (response.status === 200) {
        toast.success('Login Successful', {
          autoClose: 3000,
        });
        setUserDetails({
          email: "",
          password: "",
        });
        const user = JSON.stringify(response.data.userDetails.userObject);
        sessionStorage.setItem("user", user);
        sessionStorage.setItem('token', response.data.userDetails.token);
         Navigate("/home");
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        autoClose: 3000,
      });

    }
    finally {
      SetLoading(false)
    }
  };
  return (
    <div className="Signin-Component">
      <form onSubmit={handleSubmit}>
        <p>LOGIN CREDENTIALS</p>
        <div className="Signin-Component-form-group">
          <label htmlFor="email">Email-id</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={userDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="Signin-Component-form-group">
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={userDetails.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <div className="Signin-Component-Lowercon">
          <p>New To ECOMCART?</p>
          <Link to={"/Register"}>REGISTER BY CLICKING HERE</Link>
        </div>
      </form>
    </div>
  );
}
export default Signin;
