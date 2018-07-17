import React from "react";
import classes from "./Logo.css";
import burgerLogo from "./../../assets/burger-logo.png";

const logo = () => (
  <div className={classes.Logo}>
    <img src={burgerLogo} alt="My Burger" />
  </div>
);

export default logo;
