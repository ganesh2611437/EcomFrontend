import React from "react";
import { useState,useEffect, useContext} from "react";
import axios from "axios";
import "./Orderedproducts.css";
import { appContext } from "../../../App";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../../Helper";
function Orderedproducts() {
  const [Products, SetProducts] = useState([]);
  const { SetLoading} = useContext(appContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        SetLoading(true);
        const token = sessionStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        if(!token){
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/api/user/orders`
        , {headers});
        SetProducts(response.data);
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
  return (
    <div className="Orderedproducts-Component">
      <div className="Orderedproducts-Component-Container">
        <div className="Orderedproducts-Component-Container1">
        <div className="Orderedproducts-Component-Container-Top">
          <ul>
            <li>Item</li>
            <li>Order Id</li>
            <li>Status</li>
          </ul>
        </div>
        <div className="Orderedproducts-Component-Container-Bottom">
        {Products.length > 0 ? (
            Products.slice(0).reverse().map((Product,Index) => (
          <div className="Orderedproducts-Component-Container-Bottom-Items" key={Index}>
            <div className="Orderedproducts-Component-Container-Bottom-Items-ImageandTitle-Container">
              <div className="Orderedproducts-Component-Container-Bottom-Items-Image-Container">
                <img src={Product.product.image} alt="" />
              </div>
              <p>{Product.product.title}</p>
              <p>{Product.quantity}</p>
            </div>
            <div className="Orderedproducts-Component-Container-Bottom-Items-OrderId-Container">
              <p>{Product._id}</p>
            </div>
            <div className="Orderedproducts-Component-Container-Bottom-Items-Status">
              <p>{Product.status}</p>
            </div>
          </div>
              ))
              ) : (
                <div className="Orders-Component-Notfound Cart-Component-Notfound"> No products found !</div>
              ) }
        </div>
        </div>
      </div>
    </div>
  );
}

export default Orderedproducts;
