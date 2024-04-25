import React from "react";
import "./Carousel.css";
import { useEffect, useState,useContext } from "react";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import Product from "../../Products/Product.jsx";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { appContext } from '../../../App';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../../Helper.js";
function Carousel() {
  const [Products, SetProducts] = useState([]);
  const { SetLoading } = useContext(appContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        SetLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/admin/products/featured`
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
  }, []);
  const options = {
    nav: false,
    loop: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3500,
    responsive: {
      0: {
        items: 1,
      },
      310: {
        items: 2,
      },
      420: {
        items: 2,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },

      1100: {
        items: 4,
      },
    },
  };
  return (
    <div className="Home-Carousel">
      <div className="Home-Carousel-Head">
        <p>FEATURED PRODUCTS...</p>
      </div>
      <div className="Home-Carousel-Container">
      {Products.length > 0 && (
          <OwlCarousel id="Home-Carousel-Owl" className="owl-theme" {...options}>
            {Products.map((product) => (
              <Product
                key={product._id}
                id = {product._id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            ))}
          </OwlCarousel>
        )}
      </div>
    </div>
  );
}
export default Carousel;
