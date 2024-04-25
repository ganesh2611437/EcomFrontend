import React from "react";
import "./Cart.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appContext } from "../../../App";
import { BASE_URL } from "../../../Helper";
function Cart() {
  const navigation = useNavigate();
  const { SetLoading,Setischanged, ischanged } = useContext(appContext);
  const [Products, SetProducts] = useState([]);
  const [totalPrice, SetTotalPrice] = useState();
  const fetchData = async () => {
    SetLoading(true);
    const token = sessionStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get(`${BASE_URL}/api/user/cart`, {
        headers,
      });
      SetProducts(response.data.cart);
      SetTotalPrice(response.data.totalPrice);
    } catch (error) {
      toast.error(`Error fetching data`, {
        autoClose: 2000,
      });
    } finally {
      SetLoading(false);
      Setischanged(!ischanged);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleQuantity = async (productId, operation) => {
    try {
      SetLoading(true);
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.patch(
        `${BASE_URL}/api/user/cart/editquantity/${productId}/${operation}`,
        {},
        { headers }
      );
      if (response.status == 200) {
        fetchData();
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        autoClose: 2000,
      });
    } finally {
      SetLoading(false);
      Setischanged(!ischanged);
    }
  };
  const handleCartDelete = async (productId) => {
    try {
      SetLoading(true);
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(
        `${BASE_URL}/api/user/cart/delete/${productId}`,
        { headers }
      );
      if (response.status == 200) {
        fetchData();
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        autoClose: 2000,
      });
    } finally {
      SetLoading(false);
      Setischanged(!ischanged);
    }
  };
  // add orders to cart
  const handleManageorders = async()=>{
    if(Products.length < 1){
      toast.warn('Please add items to cart', {
        autoClose: 2000,
      });
      return;
    }
   try{
  SetLoading(true);
  const token = sessionStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const response = await axios.get(`${BASE_URL}/api/user/manageorders` , {headers});
  if(response.status == 201){
    toast.success('Order placed successfully', {
      autoClose: 2000,
    });
    navigation('/orders');
  }
   }catch(error){
    toast.error(`${error.response.data.message}`, {
      autoClose: 2000,
    });
   }finally{
   SetLoading(false);
   Setischanged(!ischanged);
   }
  }
  return (
    <div className="Cart-Component">
      <div className="Cart-Component-Left-Container">
        <div className="Cart-Component-Left-Above">
          <p>Added Products:</p>
          <button onClick={() => {
          handleCartDelete("all")}}>Clear all</button>
        </div>
        <div className="Cart-Component-Left">
          {Products.length > 0 ? (
           Products.slice(0).reverse().map((Product, index) => (
              <div className="Cart-Component-Left-Items" key={index}>
                <div className="Cart-Component-Left-Items-ImageTitleContainer">
                  <div className="Cart-Component-Left-Items-Image-Container">
                    <img src={Product.product.image} alt="" />
                  </div>
                  <p>{Product.product.title}</p>
                </div>
                <div className="Cart-Component-Left-Items-Price-Container">
                  <p>{Product.product.price} ₹</p>
                </div>
                <div className="Cart-Component-Left-Items-Quantity-Container">
                  <button
                    onClick={() => {
                      handleQuantity(Product.product._id, "subtract");
                    }}
                  >
                    -
                  </button>
                  <input type="text" value={Product.quantity} readOnly />
                  <button
                    onClick={() => {
                      handleQuantity(Product.product._id, "add");
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="Cart-Component-Left-Items-FinalPrice-Container">
                  <p>{Product.product.price * Product.quantity} ₹</p>
                </div>
                <div className="Cart-Component-Left-Items-DeleteProduct-Container">
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    size="xl"
                    onClick={() => handleCartDelete(Product.product._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="Cart-Component-Notfound"> No products found !</div>
          )}
        </div>
        <div className="Cart-Component-Bottom-Price">
          <p>Total:</p>
          <p>{totalPrice} ₹</p>
        </div>
        <div className="Cart-Componene-Bottom-Checkout">
          <button onClick={handleManageorders}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
