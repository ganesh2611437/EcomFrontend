import React from "react";
import "./Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  faAngleDown,
  faAngleUp,
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import Searchproducts from "../../Other/Searchproducts/Searchproducts";
import { useContext } from 'react';
import { appContext } from '../../../App';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from "../../../Helper";
import debounce from 'lodash/debounce';
function Navigation() {
  const navigate = useNavigate();
  const { LoginRole, SetLoginRole, CurrentUser,ischanged,SearchInput,SetSearchInput,Products,SetProducts} = useContext(appContext);
  const [DropdownToggle, SetDropdownToggle] = useState(false);
  const[numberofitems,SetNumberofitems] = useState(0);
  const [SearchToggle, SetSearchToggle] = useState(false);
  const[searchedProducts,SetSearchedProducts] = useState([]);
  useEffect(() => {
    const fetchTokenAndDecode = () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
        }
        if (token) {
          const decodedUser = jwtDecode(token);
          SetLoginRole(decodedUser.userRole);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    fetchTokenAndDecode();
  }, [sessionStorage.getItem("token")]);
  //debouncing search
  async function fetchData() {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/user/searchedproducts/${SearchInput || "shirtsvfuhuhuhghfg"}`
      );
      SetSearchedProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:");
    }
  }
  useEffect(()=>{
    fetchData();
    if (SearchInput === "") {
      document.getElementById("Home-Navigation-Middle-Search").value = "";
      SetSearchToggle(false);
    }
  },[SearchInput])
const deb = useCallback(
  debounce((text) => {
    if (text.trim().length === 0) {
      SetSearchToggle(false);
      SetSearchedProducts([]);
    } else {
      SetSearchToggle(true);
    }
    SetSearchInput(text);
  }, 500),
  []
);
const handleSearchDebounce = (text) => {
  deb(text);
};
const handleInputClear = ()=>{
  SetProducts(searchedProducts);
  SetSearchInput("");
}
//
  function HandleDropdownToggle() {
    SetDropdownToggle(!DropdownToggle);
  }
  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    SetLoginRole("guest");
    toast.success('Logout Successful', {
      autoClose: 3000,
    });
    navigate('/Home');
    SetDropdownToggle(!DropdownToggle);
  }
  useEffect(()=>{
    const handleNumberofitems = async()=>{
      try{
        const token = sessionStorage.getItem('token');
        if(!token){
          return;
        }
        const headers = {
          'Authorization': `Bearer ${token}`,
        };
 
      const response = await axios.get(`${BASE_URL}/api/user/cart/numberofitems`, {headers});
     SetNumberofitems(response.data.numberOfItems);
      }catch(error){
      console.log("Error fetching some data");
      }
    }
    handleNumberofitems();
  },[ischanged,sessionStorage.getItem('token')]);
  return (
    <div className="Home-Navigation">
      <header>
        <div className="Home-Navigation-Left">
          <Link to="/Home">
            
            <p>Ecom Shopping...</p>
          </Link>
        </div>
        <div className="Home-Navigation-Middle">
          <input
            type="text"
            onChange={(e)=> handleSearchDebounce(e.target.value)}
            id="Home-Navigation-Middle-Search"
            placeholder="Search Products here"
          />
          <div
            className={
              SearchToggle
                ? "Home-Navigation-Middle-Search-Items-Container SearchDropdownActive"
                : "Home-Navigation-Middle-Search-Items-Container"
            }
          >
            {searchedProducts.length >0 ? (searchedProducts.map((product,index) => (
              <Searchproducts
                key={index}
                id = {product._id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            ))): ( <div className="Navigation-Component-Searchbar-Productnotfound">NO PRODUCTS FOUND </div>)}
          </div>
           <Link to="/Searchedresults" onClick={handleInputClear}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={window.innerWidth < 576 ? "sm" : "lg"}
            style={{ color: "var(--accent)" }}
          />
           </Link>

        </div>
        <div className="Home-Navigation-Right">
          {LoginRole == "admin" ? (
            <>
              <Link to="/Manageorders">
                <p>Manage Orders</p>
              </Link>
              <Link to='/Addproduct'>
                <p>Add Product</p>
              </Link>
            </>
          ) : null}
          {LoginRole == "guest" ? (
            <>
              <Link to="/Login">
                <p>LOGIN</p>
              </Link>
              <Link to="/Register">
                <p>REGISTRATION</p>
              </Link>
            </>
          ) : null}
          {LoginRole === "customer" ? (
            <>
              <Link to="/Orders">
                <p>MY ORDERS</p>
              </Link>
              <Link to="/Cart">
                <div className="Home-Navigation-Right-CartContainer">
                  <FontAwesomeIcon icon={faCartShopping} size="lg" />
                  <sup>{numberofitems}</sup>
                </div>
              </Link>
            </>
          ) : null}
        </div>
        <div className="Home-Navigation-Profile">
          <div className="Home-Navigation-Image-Container">
            <img src={CurrentUser?.image || "https://vectorified.com/images/guest-icon-3.png"} alt="" onClick={HandleDropdownToggle} />
          </div>
          <div className="Home-Navigation-Dropdown">
            <FontAwesomeIcon
              icon={DropdownToggle ? faAngleUp : faAngleDown}
              onClick={HandleDropdownToggle}
              size={window.innerWidth < 768 ? "xs" : "sm"}
            />
            <ul className={DropdownToggle ? "DropdownActive" : ""}>
              {LoginRole == "guest" ? (
                <>
                  <Link to="/Register">
                    <li>Create Account</li>
                  </Link>
                </>
              ) : null}
              {LoginRole === "admin" || LoginRole === "customer"? (
                <>
                  <Link to="/profile">
                    <li>View Profile</li>
                  </Link>
                </>
              ) : null}
                  {LoginRole == "admin" ? (
                <>
                  <Link to="/manageproducts">
                    <li>Manage Products</li>
                  </Link>
                </>
              ) : null}
              {LoginRole == "admin" && window.innerWidth < 768 ? (
                <>
                  <Link to='/Manageorders'>
                    <li>Manage Orders</li>
                  </Link>
                  <Link to='/Addproduct'>
                    <li>Add Product</li>
                  </Link>
                </>
              ) : null}
              {LoginRole == "guest" && window.innerWidth < 768 ? (
                <>
                  <Link to="/Login">
                    <li>LOGIN</li>
                  </Link>
                </>
              ) : null}
              {LoginRole == "customer" && window.innerWidth < 768 ? (
                <>
                  <Link to="/Orders">
                    <li>My Orders</li>
                  </Link>
                  <Link to="/Cart">
                    <div className="Home-Navigation-Right-CartContainer">
                      <li>Cart</li>
                      <FontAwesomeIcon icon={faCartShopping} size="xs" />
                      <sup>{numberofitems}</sup>
                    </div>
                  </Link>
                </>
              ) : null}
              {LoginRole === "admin" || LoginRole === "customer" ? (
                <>
                  <li onClick={handleLogout}>Logout</li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}
export default Navigation;
