import React from 'react'
import './Signup.css'
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { appContext } from '../../../App';
import { BASE_URL } from '../../../Helper';
function Signup() {
  const [image, setImage] = useState();
  const {SetLoading} = useContext(appContext);
  const [croppedImage, setCroppedImage] = useState();
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmpassword:"",
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
    if(userDetails.password !== userDetails.confirmpassword){
      toast.warn("Passwords don't match", {
        autoClose: 3000,
    });
    SetLoading(false);
    return;
    }
    const formData = new FormData();
    formData.append('name', userDetails.name);
    formData.append('email', userDetails.email);
    formData.append('address', userDetails.address);
    formData.append('password', userDetails.password);
    formData.append('image', image);
    try {
      const response = await axios.post(`${BASE_URL}/api/user/register`, formData);
      if (response.status === 201) {
        toast.success('Registration Successful', {
          autoClose: 3000,
        });
        const resetForm = () => {
          setUserDetails({
            name: "",
            email: "",
            address: "",
            password: "",
          });
          setImage(null);
          setCroppedImage(null);
        };
        resetForm();
        navigate('/Login');
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.warn(`${error.response.data.message}`, {
          autoClose: 3000,
        });
      }
      else {
        toast.error(`${error.response.data.message}`, {
          autoClose: 3000,
        });
      }
    }
    finally {
      SetLoading(false)
    }
  };

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const aspectRatio = 1;
        const { width, height } = img;
        let newWidth = width;
        let newHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (width > height) {
          newWidth = height * aspectRatio;
          newHeight = height;
          offsetX = (width - newWidth) / 2;
        } else {
          newHeight = width * aspectRatio;
          newWidth = width;
          offsetY = (height - newHeight) / 2;
        }
        canvas.width = aspectRatio * 100;
        canvas.height = 100;
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight, 0, 0, canvas.width, canvas.height);
        setCroppedImage(canvas.toDataURL());
      };

      img.src = URL.createObjectURL(image);
    }
  }, [image]);
  return (
    <>
      <div className= "Signup-Component" >

        <form onSubmit={handleSubmit}>
          <p>NEW REGISTRATION</p>
          <div className='Profilepage-Image-Container' onClick={handleImageClick}>
            <img
              src={croppedImage || "https://cdn1.iconfinder.com/data/icons/social-media-2057/128/1-47-512.png"}
              alt=""
            />
          </div>
          <input type="file" accept="image/*"  onChange={handleFileChange} ref={inputRef} style={{ display: 'none' }} />
          <div className="Signup-Component-form-group">
            <label htmlFor="email">NAME</label>
            <input
              type="name"
              id="name"
              name="name"
              placeholder="enter your Name here"
              value={userDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="Signup-Component-form-group">
            <label htmlFor="email">EMAIL-ID</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="enter your email-id here"
              value={userDetails.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="Signup-Component-form-group">
            <label htmlFor="address">ADDRESS</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="enter your Address here"
              value={userDetails.address}
              onChange={handleInputChange}

            />
          </div>
          <div className="Signup-Component-form-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="create your new password here"
              value={userDetails.password}
              onChange={handleInputChange}
              title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and can contain special characters."
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
              required
            />
          </div>
          <div className="Signup-Component-form-group">
            <label htmlFor="password">CONFIRM PASSWORD</label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="re enter your password here"
              value={userDetails.confirmpassword}
              onChange={handleInputChange}
              title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and can contain special characters."
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
              required
            />
          </div>
          <button type="submit">REGISTER BY CLICKING HERE</button>
          <div className="Signup-Component-Lowercon">
            <p>Already have account?</p>
            <Link to={"/Login"}>Login</Link>
          </div>
        </form>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
    </>
  );
}
export default Signup;
