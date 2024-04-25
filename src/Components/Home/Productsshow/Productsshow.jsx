import React, { useState, useEffect, useContext ,useRef } from "react";
import "./Productsshow.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Product from "../../Products/Product.jsx";
import { appContext } from '../../../App';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../../Helper.js";
function Productsshow() {
  const { SetLoading,scrollRef } = useContext(appContext);
  const [activeName, setActiveName] = useState("all");
  const [Products, SetProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      SetLoading(true);
      try {
        const response = await axios.get(
   `${BASE_URL}/api/admin/products/${activeName}`
        );
        SetProducts(response.data.filteredProducts);
      } catch (error) {
        toast.error(`Error Fetching Data`, {
          autoClose: 3000,
      });
      }finally{
        SetLoading(false);
      }
    };
    fetchData();
  }, [activeName]);
  const HandleNavigationClick = (name) => {
    setActiveName(name);
  };
  return (
    <div className="Home-Productsshow" ref={scrollRef}>
      <div className="Home-Productsshow-Nav">
        <ul>
          <Link
            to="/Home/AllProducts"
            onClick={() => HandleNavigationClick("all")}
          >
            <li
              className={
                activeName === "all"
                  ? "Home-Productsshow-Nav-Active"
                  : ""
              }
            >
              All PRODUCTS
            </li>
          </Link>
          <Link
            to="/Home/Men's"
            onClick={() => HandleNavigationClick("men")}
          >
            <li
              className={
                activeName === "men" ? "Home-Productsshow-Nav-Active" : ""
              }
            >
              Men's
            </li>
          </Link>
          <Link
            to="/Home/Women's"
            onClick={() => HandleNavigationClick("women")}
          >
            <li
              className={
                activeName === "women" ? "Home-Productsshow-Nav-Active" : ""
              }
            >
              Women's
            </li>
          </Link>
          <Link
            to="/Home/Kids"
            onClick={() => HandleNavigationClick("kid")}
          >
            <li
              className={
                activeName === "kid" ? "Home-Productsshow-Nav-Active" : ""
              }
            >
              Kids
            </li>
          </Link>
        </ul>
      </div>
      <div className="Home-Productsshow-Products-Container">
        {Products.map((product,index) => (
          <Product
            key={index}
            id = {product._id}
            title={product.title}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
export default Productsshow;
