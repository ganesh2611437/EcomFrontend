import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faXTwitter,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
function Footer() {
  return (
    <div className="Home-Footer">
      <div className="Home-Footer-Upper">
        <p>Contact Developer</p>
        <div className="Home-Footer-Upper-ContentContainer">
          <div className="Home-Footer-Upper-ContentContainer-Child1">
            <div>
              <img src="" alt="" />
              <a
                href="https://github.com/ganesh2611437"
                target="blank"
              >
                <h2>--GANESH KODIHALLI</h2>
              </a>
            </div>
            <div>
              <FontAwesomeIcon icon={faEnvelope} />
              <a href="mailto:ykganesh11@gmail.com" target="blank">
                ykganesh11@gmail.com
              </a>
            </div>
          </div>
          <div className="Home-Footer-Upper-ContentContainer-Child2">
            <p>CONNECT-US :</p>
            <div className="Home-Footer-Upper-ContentContainer-Child2-Icons-Container">
              
              <a
                href="https://github.com/ganesh2611437"
                target="_blank"
                className="Social-Icons-Container"
              >
                <FontAwesomeIcon icon={faGithub}/>
                <p>Github</p>
              </a>
              <a
                href="www.linkedin.com/in/ganeshkodihalli"
                target="_blank"
                className="Social-Icons-Container"
              >
                <FontAwesomeIcon icon={faLinkedin} />
                <p>LinkedIn</p>
              </a>
              <a
                href="tel:8307109697"
                target="_blank"
                className="Social-Icons-Container"
              >
                <FontAwesomeIcon icon={faPhone} />
                <p>9964037294</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="Home-Footer-Lower">
        <p>&copy; 2023 EcomShoppingCart. All rights reserved </p>
      </div>
    </div>
  );
}

export default Footer;
