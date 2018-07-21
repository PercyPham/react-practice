import React from "react";
import Logo from "../../Logo";
import NavigationItems from "../NavigationItems";
import classes from "./SideDrawer.css";
import Backdrop from "./../../UI/Backdrop";

const sideDrawer = props => {
  const attachedClasses = [classes.SideDrawer];
  attachedClasses.push(props.open ? classes.Open : classes.Close);
  return (
    <React.Fragment>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(" ")}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </React.Fragment>
  );
};

export default sideDrawer;
