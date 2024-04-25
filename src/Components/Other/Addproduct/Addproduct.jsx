import React from "react";
import { useState, useRef, useEffect } from "react";
import "./Addproduct.css";
import { useContext } from 'react';
import { appContext } from '../../../App';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { BASE_URL } from "../../../Helper";
function Addproduct() {
    const [image, setImage] = useState();
    const { SetLoading } = useContext(appContext);
    const [imageHolder, setImageHolder] = useState();
    const [featuredCheck, SetFeaturedCheck] = useState(false);
    const [productDetails, SetProductDetails] = useState({
        title: "",
        price: "",
        description: "",
        category: "men",
        isFeatured: featuredCheck,

    })
    const inputRef = useRef(null);
    const handleImageClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    const handleImageRemove= ()=>{
        setImageHolder(null);
        setImage(null);
        if (inputRef.current) {
            inputRef.current.value = null;
        }
      }
      const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const selectedImage = e.target.files[0];
            const imageUrl = URL.createObjectURL(selectedImage);
            setImage(selectedImage);
            setImageHolder(imageUrl);
        }
    };
    const handleFeaturedCheck = () => {
        SetFeaturedCheck((prevCheck) => !prevCheck);
        SetProductDetails((prevDetails) => ({
            ...prevDetails,
            isFeatured: !prevDetails.isFeatured,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "category") {
            SetProductDetails((prevDetails) => ({
                ...prevDetails,
                category: value,
            }));
        } else {
            SetProductDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        SetLoading(true);
        if (!image || !image.type) {
            toast.warn("Please Upload Image", {
                autoClose: 3000,
            });
            SetLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("title", productDetails.title);
        formData.append("price", Number(productDetails.price));
        formData.append("description", productDetails.description);
        formData.append("category", productDetails.category);
        formData.append("isFeatured", productDetails.isFeatured);
        formData.append("image", image);
        try {
            const token = sessionStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/api/admin/addproduct`, formData, { headers });
            if (response.status == 201) {
                toast.success('Product Added Sucessfully', {
                    autoClose: 3000,
                });
                SetProductDetails({
                    title: "",
                    price: "",
                    description: "",
                    category: "men",
                    isFeatured: featuredCheck,
                });
            }
        }
        catch (error) {
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
            SetLoading(false);
            setImage(null);
            setImageHolder(null);
        }
    }
    return (
        <div className="Addproduct-Component">
            <form onSubmit={handleOnSubmit} className="Addproduct-Component-Container">
                <div className="Addproduct-Details-Container">
                    <p>Title</p>
                    <input type="text" required placeholder="Enter Title" name="title" value={productDetails.title} onChange={handleInputChange} />
                </div>
                <div className="Addproduct-Details-Container">
                    <p>Price</p>
                    <input type="Number" required placeholder="Enter price" min="0" name="price" value={productDetails.price} onChange={handleInputChange} />
                </div>
                <div className="Addproduct-Details-Container">
                    <p>Description</p>
                    <textarea placeholder="Enter product Description" required name="description" value={productDetails.description} onChange={handleInputChange} ></textarea>
                </div>
                <div className="Addproduct-Details-Container">
                    <p>Select Category</p>
                    <select id="myDropdown" name="category"
                        value={productDetails.category}
                        onChange={handleInputChange} >
                        <option value="men" >Men's</option>
                        <option value="women" >Women's</option>
                        <option value="kid">Kids</option>
                    </select>
                </div>
                <div className="Addproduct-Details-Container">
                    <p>Add Product Image</p>
                    <div
                        className="Addproduct-Image-Main-Container"
                    >
                         <FontAwesomeIcon icon={faX} onClick={handleImageRemove} />
                        <div className="Addproduct-Image-Container"        onClick={handleImageClick}>
                            <img
                                src={
                                    imageHolder
                                        ? imageHolder
                                        : "https://cdn3.iconfinder.com/data/icons/photo-tools/65/upload-1024.png"
                                }
                                alt="Loading..."
                            />
                        </div>
                    </div>
                </div>
                <div className='Addproduct-Changepassword-Ask'>
                    <p>Featured Product ?</p>
                    <input type="checkbox" id="changePassword" name="change_password" value="yes" checked={featuredCheck}
                        onChange={handleFeaturedCheck} />
                </div>
                <div className="Addproduct-Button-Container">
                    <button type="submit">Save</button>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={inputRef}
                    style={{ display: "none" }}
                />
            </form>

        </div>
    );
}

export default Addproduct;
