import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Manageorders.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { appContext } from '../../../App';
import { BASE_URL } from '../../../Helper';
function Manageorders() {
  const [Products, setProducts] = useState([]);
  const [deliveryStatus, SetDeliveryStatus] = useState({});
  const { SetLoading} = useContext(appContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        SetLoading(true);
        const token = sessionStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        const response = await axios.get(`${BASE_URL}/api/admin/orders` , {headers} );
        setProducts(response.data.orders);
        const statusMap = {};
        response.data.orders.forEach((product) => {
          statusMap[product._id] = product.status;
        });
        SetDeliveryStatus(statusMap);
      } catch (error) {
        toast.error(`Error fetching data`, {
          autoClose: 2000,
        });
      }finally{
        SetLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleInputChange = (e,productId)=>{
    SetDeliveryStatus((prevStatus) => ({
      ...prevStatus,
      [productId]: e.target.value,
    }));
  }
  const updateDeliveryStatus = async(orderId)=>{
    try{
      SetLoading(true);
      const status = deliveryStatus[orderId];
      const token = sessionStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
      };
      const response = await axios.patch(`${BASE_URL}/api/admin/updateorder/${orderId}`, {status}, {headers});
      if(response.status == 200){
        toast.success(`Order updated successfully!`, {
          autoClose: 2000,
        });
      }
    }catch(error){
      toast.error(`Error sending request`, {
        autoClose: 2000,
      });
    }finally{
      SetLoading(false);
    }
  }
  return (
    <div className='Manageorders-Component'>
      {Products.length > 0 ? (
        Products.slice(0).reverse().map((product,index) => (
          <div className='Manageorders-Container' key={index}>
            <div className='Manageorders-Image-Container'>
              <img src={product.product.image} alt={product.product.title} />
            </div>
            <div className='Manageorders-Details-Container'>
              <p>{product.product.title}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Customer: {product.customer.username}</p>
              <p>Delivering to: {product.customer.address}</p>
              <select value={deliveryStatus[product._id]} onChange={(e)=>handleInputChange(e,product._id)}>
                <option value='Dispatched'>Dispatched</option>
                <option value='Out for delivery'>Out for delivery</option>
                <option value='Delivered'>Delivered</option>
              </select>
            </div>
            <div className='Manageorders-Button-Container'>
              <button onClick={()=>{updateDeliveryStatus(product._id)}}>Update</button>
            </div>
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default Manageorders;
