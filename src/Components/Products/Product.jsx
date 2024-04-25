import React from "react";
import "./Product.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { appContext } from '../../App';
import { BASE_URL } from "../../Helper";

function Product(props) {
  const { LoginRole,SetLoading,Setischanged,ischanged } = useContext(appContext);
  const handleAddtocart = async (productId) => {
    if (LoginRole == "admin" || LoginRole == "guest") {
      toast.warn('Login from customer account', {
        autoClose: 2000,
      });
      return
    }
    try {
      SetLoading(true);
      const token = sessionStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await axios.post(`${BASE_URL}/api/user/cart/addproduct/${productId}`, {}, { headers });
      if (response.status == 200) {
        toast.success('Product added to cart', {
          autoClose: 2000,
        });
        Setischanged(!ischanged);
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        autoClose: 2000,
      });

    }
    finally{
      SetLoading(false);
    }
  }
  return (
    <div className="Product">
      <div className="Product-Image-Container">
        <Link to={`/product/${props.id}`}>
          <img src={props.image} alt="image" />
        </Link>
      </div>
      <p>{props.title}</p>
      <p>{`${props.price} ₹`}</p>
      <div className="Product-Button-Container">
        <button onClick={() => { handleAddtocart(props.id) }} >Add to Cart</button>
      </div>
    </div>
  );
}

export default Product;
