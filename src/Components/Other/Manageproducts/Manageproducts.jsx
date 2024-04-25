import React from 'react'
import './Manageproducts.css';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import "../Addproduct/Addproduct.css";
import { useContext } from 'react';
import { appContext } from '../../../App';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../Helper';
function Manageproducts() {
  const [products, Setproducts] = useState([]);
  const [image, setImage] = useState();
  const { SetLoading } = useContext(appContext);
  const [deleteProductId, SetDeleteProductId] = useState();
  const [editProductId, SetEditProductId] = useState();
  const [handleEditToggle, SethandleEditToggle] = useState(false);
  const [handleDeleteToggle, SetHandleDeleteToggle] = useState(false);
  const [imageHolder, setImageHolder] = useState();
  const [featuredCheck, SetFeaturedCheck] = useState(false);
  const [productDetails, SetProductDetails] = useState({
    title: "",
    price: "",
    description: "",
    category: "men",
    isFeatured: featuredCheck,

  });
  //fetch all data
  const fetchData = async () => {
    try {
      SetLoading(true)
      const response = await axios.get(`${BASE_URL}/api/admin/products/all`);
      Setproducts(response.data.filteredProducts);
    } catch (error) {
      toast.error(`Error fetching data`, {
        autoClose: 2000,
      });
    }
    finally{
      SetLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  //handleing image
  const inputRef = useRef(null);
  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  //handleing image file change
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedImage = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedImage);
      setImage(selectedImage);
      setImageHolder(imageUrl);
    }
  };
  //featured check
  const handleFeaturedCheck = () => {
    SetFeaturedCheck((prevCheck) => !prevCheck);
    SetProductDetails((prevDetails) => ({
      ...prevDetails,
      isFeatured: !prevDetails.isFeatured,
    }));
  };
  //handles input change
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
  //handles toggleforedit
  const handleToggleforEdit = () => {
    SethandleEditToggle(!handleEditToggle);
    SetProductDetails({
      title: "",
      price: "",
      description: "",
      category: "men",
      isFeatured: featuredCheck,
    });
  }
  //for edit button
  const handleToggleforEditButton = (id) => {
    handleToggleforEdit();
    let tempproduct = products.filter(product => product._id == id);
    SetProductDetails({
      title: `${tempproduct[0].title}`,
      price: `${tempproduct[0].price}`,
      description: `${tempproduct[0].description}`,
      category: `${tempproduct[0].category}`,
      isFeatured: `${tempproduct[0].isFeatured}`,
    });
    SetFeaturedCheck(tempproduct[0].isFeatured);
    setImageHolder(tempproduct[0].image);
    SetEditProductId(id);
  }
  //handle image delete
  const handleImageRemove = () => {
    setImageHolder(null);
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = null;
  }
  }
  //handle toggle for delete
  const handleToggleforDelete = (productid) => {
    SetHandleDeleteToggle(true);
    SetDeleteProductId(productid);
  }
  //handle toggle for celete(cancel button)
  const handleToggleforCancel = () => {
    SetHandleDeleteToggle(false);
  }
  //handle deletion
  const handleConfirmDeletion = async () => {
    SetLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await axios.delete(`${BASE_URL}/api/admin/product/${deleteProductId}`, { headers });
      if (response.status == 200) {
        toast.success(`${response.data.message}`, {
          autoClose: 3000,
        });
        SetLoading(false);
        SetHandleDeleteToggle(false);
        return
      }
    } catch (error) {
      if (error.response.status == 404) {
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
      SetHandleDeleteToggle(false);
      fetchData();
    }
  }

  //handle Patch request for product.................
  const handleProductEdit = async (e) => {
    e.preventDefault();
    SetLoading(true);
    if (!image && !imageHolder) {
      SetLoading(false);
      toast.warn("Please Upload Image", {
        autoClose: 3000,
      });
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const formData = new FormData();
      formData.append("title", productDetails.title);
      formData.append("price", productDetails.price);
      formData.append("description", productDetails.description);
      formData.append("category", productDetails.category);
      formData.append("isFeatured", featuredCheck);
      if (image) {
        formData.append("image", image);
      }
      const response = await axios.patch(`${BASE_URL}/api/admin/editproduct/${editProductId}`, formData, { headers });
      if (response.status == 200) {
        toast.success(`${response.data.message}`, {
          autoClose: 3000,
        });
        SethandleEditToggle(false);
        setImage(null);
        setImageHolder(null);
        fetchData();
        return;
      }
    } catch (error) {
      if (error.response.status >= 400 && error.response.status < 500) {
        toast.warn(`${error.response.data.message}`, {
          autoClose: 3000,
        });
        setImage(null);
        setImageHolder(null);
      }
      else {
        toast.error(`${error.response.data.message}`, {
          autoClose: 3000,
        });
      }
    }
    finally {
      SetLoading(false);
    }
  }
  return (
    <div className='Manageproducts-Component'>
      <div className='Manageproducts-Products-Parent-Container'>
        <p>Manage Products</p>
        <div className='Manageproducts-Products-Container'>
          {products.length > 0 && products.slice(0).reverse().map((product) => (
            <div key={product._id} className='Manageproducts-Product'>
              <div className='Manageproducts-Product-Imagecon'>
                <Link to={`/product/${product._id}`}>
                  <img src={product.image} alt="Product Image"/>
                </Link>
              </div>
              <div className='Manageproducts-Product-Detailscon'>
                <p>{product.title}</p>
                <div className='Manageproducts-Product-Deletecon'>
                  <p>{product.price} ₹</p>
                  <FontAwesomeIcon icon={faTrashCan} onClick={() => handleToggleforDelete(product._id)} />
                </div>
                <div className='Manageproducts-Product-Detailscon-Buttoncon' onClick={() => handleToggleforEditButton(product._id)}>
                  <p>Edit</p>
                  <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffffff" }} />
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
      <form id='Manageproducts-Form' onSubmit={handleProductEdit} className={handleEditToggle ? "Addproduct-Component-Container Manageproducts-Form-Active" : "Addproduct-Component-Container"}>
        <FontAwesomeIcon icon={faX} onClick={handleToggleforEdit} />
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
            <div className="Addproduct-Image-Container" onClick={handleImageClick}>
              <img
                required
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
      <div className={handleDeleteToggle ? 'Manageproducts-Deletealert-Container Manageproducts-Deletealert-Container-Active' : 'Manageproducts-Deletealert-Container'}>
        <p>Confirm Deletion?</p>
        <div className='Manageproducts-Deletealert-Container-Buttonscon'>
          <button onClick={handleConfirmDeletion}>Confirm</button>
          <button onClick={handleToggleforCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Manageproducts