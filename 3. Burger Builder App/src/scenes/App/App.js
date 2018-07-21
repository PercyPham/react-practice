import React, { Component } from "react";
import Layout from "./components/Layout";
import BurgerBuilder from "./../../components/BurgerBuilder";

class App extends Component {
  render() {
    return (
      <Layout>
        <BurgerBuilder />
      </Layout>
    );
  }
}

export default App;
