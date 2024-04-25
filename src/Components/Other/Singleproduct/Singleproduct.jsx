import React from 'react'
import { useState, useEffect } from 'react'
import './Singleproduct.css'
import axios from "axios";
import { useParams, useLocation  } from 'react-router-dom';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appContext } from '../../../App';
import { BASE_URL } from '../../../Helper';
function Singleproduct() {
  const { LoginRole,SetLoading,Setischanged,ischanged} = useContext(appContext);
    const [product, SetProduct] = useState([]);
    const {pathname} = useLocation();
    const [isProduct, SetIsProduct] = useState(true);
    let { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
          SetLoading(true);
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/admin/product/${id}`
                );
                SetProduct(response.data.product);
            } catch (error) {
              if(error.response.status == 404 || error.response.status == 500 ){
              SetIsProduct(false);
              }
            }finally{
              SetLoading(false);
            }
        };
        fetchData();
    }, [pathname]);
    
    //handlecart 
    const handleAddtocart = async()=>{
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
        const response = await axios.post(`${BASE_URL}/api/user/cart/addproduct/${id}`, {}, { headers });
        if (response.status == 200) {
          toast.success('Product added to cart', {
            autoClose: 2000,
          });
        }
      } catch (error) {
        toast.error(`${error.response.data.message}`, {
          autoClose: 2000,
        });
  
      }
      finally{
        SetLoading(false);
        Setischanged(!ischanged);
      }
    }
    return (
        <div className='Singleproduct-Component'>
          {
            isProduct ?
        <div className='Singleproduct-Container'>
          <div className='Singleproduct-Image-Container'>
            <img src={product.image} alt="" />
          </div>
          <div className='Singleproduct-Details-Container'>
            <p>{product.title}</p>
            <p>{product.price} ₹</p>
            <p>{product.description}</p>
            <div className='Singleproduct-Button'>
              <button onClick={handleAddtocart}>Add to cart</button>
            </div>
          </div>
        </div>
        : "No Product Found"  }
        </div>
    )
}

export default Singleproduct