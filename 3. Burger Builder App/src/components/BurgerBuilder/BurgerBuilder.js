import React, { Component } from "react";
import Burger from "./../Burger";
import {
  SALAD,
  BACON,
  CHEESE,
  MEAT,
  INGREDIENT_PRICES
} from "./../../utils/constants";
import BuildControls from "./BuildControls";
import Modal from "./../../components/UI/Modal";
import OrderSummary from "./../OrderSummary";

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      [SALAD]: 0,
      [BACON]: 0,
      [CHEESE]: 0,
      [MEAT]: 0
    },
    totalPrice: 0,
    purchasing: false
  };

  purchasingHandler = () => {
    this.setState({
      purchasing: true
    });
  };

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    });
  };

  purchaseContinueHandler = () => {
    console.log("You continue!!!");
    alert("You continue!!!");
  };

  addIngredientHandler = type => {
    const oldIngredients = this.state.ingredients;
    const oldCount = this.state.ingredients[type];
    const newCount = oldCount + 1;

    const oldTotalPrice = this.state.totalPrice;
    const newTotalPrice = oldTotalPrice + INGREDIENT_PRICES[type];

    this.setState({
      ingredients: {
        ...oldIngredients,
        [type]: newCount
      },
      totalPrice: newTotalPrice
    });
  };

  removeIngredientHandler = type => {
    const oldIngredients = this.state.ingredients;
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) return;
    const newCount = oldCount - 1;

    const oldTotalPrice = this.state.totalPrice;
    const newTotalPrice = oldTotalPrice - INGREDIENT_PRICES[type];

    this.setState({
      ingredients: {
        ...oldIngredients,
        [type]: newCount
      },
      totalPrice: newTotalPrice
    });
  };

  render() {
    const disabledInfo = { ...this.state.ingredients };
    for (let key in disabledInfo) {
      disabledInfo[key] = this.state.ingredients[key] === 0;
    }
    return (
      <React.Fragment>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            cancelPuchase={this.purchaseCancelHandler}
            continuePurchase={this.purchaseContinueHandler}
          />
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          addFunc={this.addIngredientHandler}
          removeFunc={this.removeIngredientHandler}
          purchaseFunc={this.purchasingHandler}
          disabled={disabledInfo}
        />
      </React.Fragment>
    );
  }
}

export default BurgerBuilder;
