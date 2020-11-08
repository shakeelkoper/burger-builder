import React, { useState, useEffect, useCallback } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Aux from "../../hoc/AuxElement/AuxElements";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorhandler from "../../hoc/withErrorHandler/withErrorhandler";
import * as actions from "../../store/actions/index";

const burgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false);

	const ings = useSelector((state) => state.burgerBuilder.ingredients);
	const price = useSelector((state) => state.burgerBuilder.totalPrice);
	const error = useSelector((state) => state.burgerBuilder.error);
	const isAuthenticated = useSelector((state) => state.auth.token !== null);

	const dispatch = useDispatch();

	const onIngredientAdded = (ingName) =>
		dispatch(actions.addIngredient(ingName));
	const onIngredientRemoved = (ingName) =>
		dispatch(actions.removeIngredient(ingName));
	const onInitIngredients = useCallback(
		() => dispatch(actions.initIngredients()),
		[dispatch]
	);
	const onInitPurchase = () => dispatch(actions.purchaseInit());
	const onSetAuthRedirectPath = (path) =>
		dispatch(actions.setAuthRedirectPath(path));

	useEffect(
		() => {
			onInitIngredients();
		},
		[onInitIngredients]
	);

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	};

	const purchasehandler = () => {
		if (isAuthenticated) {
			setPurchasing(true);
		} else {
			onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelhandler = () => {
		setPurchasing(false);
	};

	const purchaseContinuehandler = () => {
		onInitPurchase();
		props.history.push("/checkout");
	};

	const disabledInfo = {
		...ings,
	};
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let orderSummary = null;

	let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
	if (ings) {
		burger = (
			<Aux>
				<Burger ingredients={ings} />
				<BuildControls
					ingredientAdded={onIngredientAdded}
					ingredientRemoved={onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(ings)}
					price={price}
					ordered={purchasehandler}
					isAuth={isAuthenticated}
				/>
			</Aux>
		);
		orderSummary = (
			<OrderSummary
				ingredients={ings}
				purchaseCancelled={purchaseCancelhandler}
				purchaseContinued={purchaseContinuehandler}
				price={price}
			/>
		);
	}

	return (
		<Aux>
			<Modal show={purchasing} modalClosed={purchaseCancelhandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Aux>
	);
};

export default withErrorhandler(burgerBuilder, axios);
