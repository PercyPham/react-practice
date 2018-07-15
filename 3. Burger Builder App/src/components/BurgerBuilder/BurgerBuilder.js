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

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      [SALAD]: 0,
      [BACON]: 0,
      [CHEESE]: 0,
      [MEAT]: 0
    },
    totalPrice: 0
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
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          addFunc={this.addIngredientHandler}
          removeFunc={this.removeIngredientHandler}
          disabled={disabledInfo}
        />
      </React.Fragment>
    );
  }
}

export default BurgerBuilder;
