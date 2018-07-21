import React, { Component } from "react";
import axios from "axios";
import OrderService from "./../../services/OrderService";
import Burger from "./../Burger";
import { SALAD, BACON, CHEESE, MEAT } from "./../../utils/constants";
import BuildControls from "./BuildControls";
import Modal from "./../../components/UI/Modal";
import OrderSummary from "./../OrderSummary";
import Spinner from "./../UI/Spinner";
import withErrorHandler from "./components/withErrorHandler";

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      [SALAD]: 0,
      [BACON]: 0,
      [CHEESE]: 0,
      [MEAT]: 0
    },
    ingredientPrices: null,
    totalPrice: 0,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount = () => {
    axios
      .get(
        "https://my-burger-builder-react-app.firebaseio.com/ingredientPrices.json"
      )
      .then(response => {
        console.log("response", response);
        this.setState({ ingredientPrices: response.data });
      })
      .catch(() => {
        this.setState({ error: true });
      });
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
    this.setState({
      loading: true
    });
    const succeed = () => {
      this.setState({
        ingredients: {
          [SALAD]: 0,
          [BACON]: 0,
          [CHEESE]: 0,
          [MEAT]: 0
        },
        totalPrice: 0,
        purchasing: false,
        loading: false
      });
    };

    const failed = () => {
      this.setState({
        loading: false
      });
    };

    const data = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice.toFixed(2),
      customer: {
        name: "Pham Minh Hung",
        email: "test@test.com",
        address: {
          street: "Testing Street Name",
          zipCode: "700000",
          country: "Vietnam"
        }
      },
      deliveryMethod: "fastest"
    };

    OrderService.order(data, succeed, failed);
  };

  addIngredientHandler = type => {
    const oldIngredients = this.state.ingredients;
    const oldCount = this.state.ingredients[type];
    const newCount = oldCount + 1;

    const oldTotalPrice = this.state.totalPrice;
    const newTotalPrice = oldTotalPrice + this.state.ingredientPrices[type];

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
    const newTotalPrice = oldTotalPrice - this.state.ingredientPrices[type];

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

    let orderSummary = this.state.loading ? (
      <Spinner />
    ) : (
      <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        cancelPuchase={this.purchaseCancelHandler}
        continuePurchase={this.purchaseContinueHandler}
      />
    );

    const burger = this.state.error ? (
      <p>Cannot load ingredients prices</p>
    ) : !this.state.ingredientPrices ? (
      <Spinner />
    ) : (
      <React.Fragment>
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

    return (
      <React.Fragment>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </React.Fragment>
    );
  }
}

export default withErrorHandler(BurgerBuilder);
