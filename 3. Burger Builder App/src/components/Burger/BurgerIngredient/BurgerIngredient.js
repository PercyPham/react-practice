import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./BurgerIngredient.css";
import {
  BREAD_BOTTOM,
  BREAD_TOP,
  MEAT,
  CHEESE,
  SALAD,
  BACON
} from "./../../../utils/constants";

class BurgerIngredient extends Component {
  render() {
    let ingredient = null;

    switch (this.props.type) {
      case BREAD_BOTTOM:
        ingredient = <div className={classes.BreadBottom} />;
        break;
      case BREAD_TOP:
        ingredient = (
          <div className={classes.BreadTop}>
            <div className={classes.Seeds1} />
            <div className={classes.Seeds2} />
          </div>
        );
        break;
      case MEAT:
        ingredient = <div className={classes.Meat} />;
        break;
      case CHEESE:
        ingredient = <div className={classes.Cheese} />;
        break;
      case SALAD:
        ingredient = <div className={classes.Salad} />;
        break;
      case BACON:
        ingredient = <div className={classes.Bacon} />;
        break;
      default:
        break;
    }

    return ingredient;
  }
}

BurgerIngredient.propTypes = {
  type: PropTypes.string.isRequired
};

export default BurgerIngredient;
