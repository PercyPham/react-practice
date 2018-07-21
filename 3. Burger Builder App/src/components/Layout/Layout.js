import React, { Component } from "react";
import classes from "./Layout.css";
import Toolbar from "./../Navigation/Toolbar";
import SideDrawer from "./../Navigation/SideDrawer";

class layout extends Component {
  state = {
    showSideDrawer: true
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  // drawerToggleClicked
  sideDrawerToggleClicked = () => {
    const showSideDrawer = !this.state.showSideDrawer;
    this.setState({ showSideDrawer });
  };

  render() {
    return (
      <React.Fragment>
        <Toolbar drawerToggleClicked={this.sideDrawerToggleClicked} />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />
        <div>Toolbar, SideDrawer, Backdrop</div>
        <main className={classes.Content}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

export default layout;
