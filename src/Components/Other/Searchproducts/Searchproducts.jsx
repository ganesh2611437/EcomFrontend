import React from 'react'
import './Searchproducts.css'
import { Link } from 'react-router-dom'
import { appContext } from '../../../App';
import { useContext } from 'react';
function Searchproducts(props) {
  const {SearchInput,SetSearchInput} = useContext(appContext);
  const handleOnClick = ()=>{
    SetSearchInput("")
  }
  return (
<Link to={`/product/${props.id}`} onClick={handleOnClick}>

    <div className='Searchproducts'>
   <div className='Searchproducts-Image-Container'>
    <img src={props.image} alt="" />
   </div>
<div className='Searchproducts-Details-Container'>
  <p>{props.title}</p>
  <p>{props.price} ₹ </p>
</div>
    </div>
    </Link>
  )
}

export default Searchproducts