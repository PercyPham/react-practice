import React from "react";
import classes from "./BuildControls.css";
import { SALAD, BACON, CHEESE, MEAT } from "./../../../utils/constants";
import BuildControl from "./BuildControl";

const controls = [
  { label: "Salad", type: SALAD },
  { label: "Bacon", type: BACON },
  { label: "Cheese", type: CHEESE },
  { label: "Meat", type: MEAT }
];

const buildControls = props => (
  <div className={classes.BuildControls}>
    <p>
      Current Price: <strong>{props.price.toFixed(2)}</strong>
    </p>
    {controls.map(ctrl => (
      <BuildControl
        key={ctrl.label}
        label={ctrl.label}
        addFunc={() => props.addFunc(ctrl.type)}
        removeFunc={() => props.removeFunc(ctrl.type)}
        disabled={props.disabled[ctrl.type]}
      />
    ))}
    <button
      className={classes.OrderButton}
      disabled={!props.price}
      onClick={() => props.purchaseFunc()}
    >
      ORDER NOW
    </button>
  </div>
);

export default buildControls;
