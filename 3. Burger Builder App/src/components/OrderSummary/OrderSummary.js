import React from "react";
import Button from "./../Button";

const orderSummary = props => {
  const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
    return (
      <li key={igKey}>
        <span style={{ textTransform: "capitalize" }}>
          {igKey}: {props.ingredients[igKey]}
        </span>
      </li>
    );
  });

  return (
    <React.Fragment>
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>{ingredientSummary}</ul>
      <p>
        <strong>Total Price: {props.price.toFixed(2)}</strong>
      </p>
      <p>Continue to Checkout?</p>
      <Button btnType="Danger" clicked={props.cancelPuchase}>
        CANCEL
      </Button>
      <Button btnType="Success" clicked={props.continuePurchase}>
        CONTINUE
      </Button>
    </React.Fragment>
  );
};

export default orderSummary;
