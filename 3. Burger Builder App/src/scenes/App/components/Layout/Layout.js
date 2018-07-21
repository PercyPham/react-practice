import React, { Component } from "react";
import classes from "./Layout.css";
import Toolbar from "./../../../../components/Navigation/Toolbar";
import SideDrawer from "./../../../../components/Navigation/SideDrawer";

class Layout extends Component {
  state = {
    showSideDrawer: false
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

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
        <main className={classes.Content}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
