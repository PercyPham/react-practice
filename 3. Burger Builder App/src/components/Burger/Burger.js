import React from "react";
import classes from "./Burger.css";
import BurgerIngredient from "./BurgerIngredient";
import { BREAD_TOP, BREAD_BOTTOM } from "./../../utils/constants";

const burger = props => {
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      return [...Array(props.ingredients[igKey])].map((_, i) => (
        <BurgerIngredient key={igKey + i} type={igKey} />
      ));
    })
    .reduce((arr, el) => arr.concat(el));

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>;
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type={BREAD_TOP} />
      {transformedIngredients}
      <BurgerIngredient type={BREAD_BOTTOM} />
    </div>
  );
};

export default burger;
