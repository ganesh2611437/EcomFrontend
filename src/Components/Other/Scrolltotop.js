import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function ScrollToTop(){
 const {pathname} = useLocation();
 useEffect(()=>{
    if(pathname != "/Home/AllProducts" && pathname != "/Home/Men's" && pathname != "/Home/Women's" && pathname != "/Home/Kids"){
        window.scrollTo(0,0);
    }
 },[pathname]);

}