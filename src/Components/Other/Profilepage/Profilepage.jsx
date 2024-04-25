import React, { useRef, useState, useEffect } from 'react';
import './Profilepage.css';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { appContext } from '../../../App';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Helper';
function Profilepage() {
    const navigate = useNavigate();
    const { CurrentUser, SetLoading,SetLoginRole,LoginRole } = useContext(appContext);
    const [image, setImage] = useState();
    const [croppedImage, setCroppedImage] = useState(CurrentUser?.image);
    const [toggleChangepassword, SetToggleChangepassword] = useState(false);
    const[deleteToggle,SetdeleteToggle] = useState(false);
    const [UserDetails, SetUserDetails] = useState({
        name: `${CurrentUser?.username}`,
        email: `${CurrentUser?.email}`,
        address: `${CurrentUser?.address}`,
        newpassword: "",
        confirmnewpassword: "",
    });
    useEffect(() => {
        if (CurrentUser) {
            SetUserDetails({
                name: CurrentUser.username,
                email: CurrentUser.email,
                address: CurrentUser.address,
            });
            setCroppedImage(CurrentUser.image);
        }
    }, [CurrentUser]);
    const inputRef = useRef(null);
    const canvasRef = useRef(null);
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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        SetUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        SetLoading(true);
        if (toggleChangepassword && UserDetails.newpassword !== UserDetails.confirmnewpassword) {
            toast.warn("Passwords don't match", {
                autoClose: 3000,
            });
            SetLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("name", UserDetails.name);
        formData.append("email", UserDetails.email);
        formData.append("address", UserDetails.address);
        if (toggleChangepassword) {
            formData.append("newpassword", UserDetails.newpassword);
        }
        formData.append("image", image);
        try {
            const token = sessionStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            let user =  JSON.parse(sessionStorage.getItem("user"));
            let userId = user._id;
            const response = await axios.patch(`${BASE_URL}/api/user/updateprofile/${userId}`, formData, { headers });
            if (response.status === 200) {
                toast.success(`${response.data.message}`, {
                    autoClose: 3000,
                });
                const user = JSON.stringify(response.data.user);
                sessionStorage.setItem("user", user);
                SetUserDetails({
                    name: `${CurrentUser?.username}`,
                    email: `${CurrentUser?.email}`,
                    address: `${CurrentUser?.address}`,
                    newpassword: "",
                    confirmnewpassword: "",
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.warn(`${error.response.data.message}`, {
                    autoClose: 3000,
                });
            } else {
                toast.error(`${error.response.data.message}`, {
                    autoClose: 3000,
                });
            }
        } finally {
            SetLoading(false);
            setImage(null);
            setCroppedImage(CurrentUser?.image);

        }
    };
    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        SetToggleChangepassword(isChecked);
    };
    //handledeletetoggle
    const handleDeleteToggle = ()=>{
      SetdeleteToggle(!deleteToggle);
    }
    //handledeleterequest
    const handlDeleteRequest = async()=>{
    let user =  JSON.parse(sessionStorage.getItem("user"));
    let userId = user._id;
    SetLoading(true);
      try{
        const token = sessionStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
      const response = await axios.delete(`${BASE_URL}/api/user/deleteprofile/${userId}`, {headers});
      console.log(response);
      if(response.status == 200){
        toast.success("User Deleted Successfully", {
            autoClose: 3000,
        });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        SetLoginRole("guest");
      }
      }catch(error){
        if (error.response && error.response.status === 400) {
            toast.warn(`${error.response.data.message}`, {
                autoClose: 3000,
            });
        } else {
            toast.error(`${error.response.data.message}`, {
                autoClose: 3000,
            });
        }
      }finally{
        SetLoading(false);
        SetdeleteToggle(false);
      }
    }
    return (
        <div className='Profilepage-Component'>
            {CurrentUser && Object.keys(CurrentUser).length > 0 && (
                <form onSubmit={handleFormSubmit} className='Profilepage-Container'>
                    {LoginRole == "admin" && <p id='Profilepage-Role'>Admin</p>}
                    <div className='Profilepage-ImageandName-Container'>
                        <div className='Profilepage-Image-Container' onClick={handleImageClick}>
                            <img
                                src={croppedImage || "https://cdn1.iconfinder.com/data/icons/social-media-2057/128/1-47-512.png"}
                                alt=""
                            />
                        </div>
                        <input type="file" onChange={handleFileChange} accept="image/*" ref={inputRef} style={{ display: 'none' }} />
                        <p>{CurrentUser?.username}</p>
                    </div>
                    <div className='Profilepage-Detailscon'>
                        <p>Name</p>
                        <input
                            type="text"
                            placeholder='Type Name'
                            value={UserDetails.name}
                            name="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='Profilepage-Detailscon'>
                        <p>Email</p>
                        <input
                            type="email"
                            placeholder='Type Email'
                            value={UserDetails.email}
                            name="email"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='Profilepage-Detailscon'>
                        <p>Address</p>
                        <input
                            type="text"
                            placeholder='Type Address'
                            value={UserDetails.address}
                            name="address"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='Profilepage-Changepassword-Ask'>
                        <div className='Profilepage-Changepassword-Ask-Detailscon'>
                            <p>Change Password ?</p>

                            <input type="checkbox" id="changePassword" name="change_password" value="yes" checked={toggleChangepassword}
                                onChange={handleCheckboxChange} />
                        </div>
                        <FontAwesomeIcon icon={faTrashCan} onClick={handleDeleteToggle} />
                    </div>
                    {
                        toggleChangepassword && <>
                            <div className='Profilepage-Detailscon'>
                                <p>New Password</p>
                                <input
                                    type="password"
                                    placeholder='Type new password'
                                    value={UserDetails.newpassword || ""}
                                    name="newpassword"
                                    required
                                    onChange={handleInputChange}
                                    title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and can contain special characters."
                                    pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&.,;:'\\\'\\\\-+=_~`<>^(){}\\[\\]\\\\\\\\|]{8,}$"
                                />
                            </div>
                            <div className='Profilepage-Detailscon'>
                                <p>Confirm password</p>
                                <input
                                    type="password"
                                    placeholder='Confirm password'
                                    value={UserDetails.confirmnewpassword || ""}
                                    name="confirmnewpassword"
                                    required
                                    onChange={handleInputChange}
                                    title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and can contain special characters."
                                    pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&.,;:'\\\'\\\\-+=_~`<>^(){}\\[\\]\\\\\\\\|]{8,}$"
                                />
                            </div>

                        </>
                    }
                    <div className='Profilepage-Button-Container'>
                        <button type="submit">Save</button>
                    </div>
                </form>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <div className={deleteToggle ? 'Manageproducts-Deletealert-Container Manageproducts-Deletealert-Container-Active' : 'Manageproducts-Deletealert-Container'}>
        <p>Confirm Account Deletion?</p>
        <div className='Manageproducts-Deletealert-Container-Buttonscon'>
          <button onClick={handlDeleteRequest}>Confirm</button>
          <button onClick={handleDeleteToggle}>Cancel</button>
        </div>
      </div>
        </div>
    );

}
export default Profilepage;
