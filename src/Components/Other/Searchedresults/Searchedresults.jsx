import React from 'react'
import './Searchedresults.css'
import { useContext } from 'react';
import { appContext } from '../../../App';
import Product from '../../Products/Product.jsx'
function Searchedresults() {
    const {Products} = useContext(appContext);


  return (
    <div className='Searchedresults-Component Manageproducts-Component'>
        <div className='Searchedresults-Component-parent-container Manageproducts-Products-Parent-Container'>
         <p>Searched Results</p>
       <div className='Searchedresults-Component-productscon Home-Productsshow-Products-Container'>
       {Products.length>0 ? (Products.map((product,index) => (
              <Product
                key={index}
                id = {product._id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            ))): ( <div className="Searchedproducts-Component-NotFound">No products found !</div>)}

       </div>
        </div>

    </div>
  )
}

export default Searchedresults