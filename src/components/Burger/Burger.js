import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/Burgeringredient'

const burger = (props) => {
  const tranformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <BurgerIngredient key={igKey + i} type={igKey} />;
      });
    });
  return(
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {tranformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default burger;