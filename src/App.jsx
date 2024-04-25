import "./index.css";
import Home from "./Components/Home/Homecontainer/Home.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./Components/Home/Navigation/Navigation.jsx";
import Footer from "./Components/Home/Footer.jsx/Footer.jsx";
import Signin from "./Components/Other/Signin/Signin.jsx";
import Signup from './Components/Other/Signup/Signup.jsx';
import Cart from "./Components/Other/Cart/Cart.jsx";
import Orderedproducts from "./Components/Other/Orderedproducts/Orderedproducts.jsx";
import Profilepage from "./Components/Other/Profilepage/Profilepage.jsx";
import Addproduct from "./Components/Other/Addproduct/Addproduct.jsx";
import Singleproduct from "./Components/Other/Singleproduct/Singleproduct.jsx";
import Manageorders from "./Components/Other/Manageorders/Manageorders.jsx";
import Manageproducts from "./Components/Other/Manageproducts/Manageproducts.jsx";
import Pagenotfound from "./Components/Other/Pagenotfound/Pagenotfound.jsx";
import Searchedresults from "./Components/Other/Searchedresults/Searchedresults.jsx";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from "./Components/Other/Protectedroute/Protectedroute.jsx";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import ScrollToTop from "./Components/Other/Scrolltotop.js";
export const appContext = createContext();
function App() {
  const scrollRef = useRef(null);
  const [CurrentUser,SetCurrentUser] = useState();
  const [Products, SetProducts] = useState([]);
  const [Loading, SetLoading] = useState(false);
  const[ischanged,Setischanged] = useState(false);
  const [SearchInput, SetSearchInput] = useState("");
  const [LoginRole, SetLoginRole] = useState("guest");
  useEffect(()=>{
    const user = JSON.parse(sessionStorage.getItem("user"));
    SetCurrentUser(user);
},[sessionStorage.getItem("user")]);
  return (
    <Router>
      <ScrollToTop/>
      <appContext.Provider value={{ SetLoading,LoginRole, SetLoginRole , SetCurrentUser,CurrentUser, ischanged,Setischanged,scrollRef,SetSearchInput,SearchInput,Products,SetProducts}}>
        <ToastContainer pauseOnFocusLoss={false}/>
        <div className="App">
          <BarLoader
            color="#2ea5a9"
            cssOverride={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: '1000'
            }}
            loading={Loading}
            margin={4}
            size={200}
            width={150}
            speedMultiplier={1}
          />
          <div className={Loading ? "App-Container App-Container-Loading" : "App-Container"}>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Login" element={<Signin />} />
              <Route path="/Register" element={<Signup />} />
              <Route path="Home/:categoryname" element={<Home />} />
              <Route
                path="/Cart"
                element={<ProtectedRoute element={Cart} allowedRoles={['customer']} />}
              />
              <Route
                path="/Orders"
                element={<ProtectedRoute element={Orderedproducts} allowedRoles={['customer']} />}
              />
              <Route
                path="/Profile"
                element={<ProtectedRoute element={Profilepage} allowedRoles={['customer', 'admin']} />}
              />
              <Route path="/Product/:id" element={<Singleproduct />} />
              <Route path="/Searchedresults" element={<Searchedresults />} />
              <Route
                path="/Manageorders"
                element={<ProtectedRoute element={Manageorders} allowedRoles={['admin']} />}
              />
                  <Route
                path="/Manageproducts"
                element={<ProtectedRoute element={Manageproducts} allowedRoles={['admin']} />}
              />
              <Route
                path="/Addproduct"
                element={<ProtectedRoute element={Addproduct} allowedRoles={['admin']} />}
              />
                 <Route path="*" element={<Pagenotfound />} />
            </Routes>

            <Footer />
          </div>
        </div>
      </appContext.Provider>
    </Router>

  );
}

export default App;
