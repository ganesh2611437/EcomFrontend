import React from 'react'
import Hero from '../Heropage/Hero.jsx'
import Productsshow from '../Productsshow/Productsshow.jsx';
import Carousel from '../Carousel/Carousel.jsx';
import './Home.css';
function Home() {
  return (
    <div className='Home'>
<Hero/>
<Productsshow/>
<Carousel/>
    </div>
  )
}

export default Home