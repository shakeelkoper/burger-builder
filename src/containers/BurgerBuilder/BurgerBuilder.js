import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
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
	const { onInitIngredients } = props;
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
		if (props.isAuthenticated) {
			setPurchasing(true);
		} else {
			props.onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelhandler = () => {
		setPurchasing(false);
	};

	const purchaseContinuehandler = () => {
		props.onInitPurchase();
		props.history.push("/checkout");
	};

	const disabledInfo = {
		...props.ings,
	};
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let orderSummary = null;

	let burger = props.error ? (
		<p>Ingredients can't be loaded!</p>
	) : (
		<Spinner />
	);
	if (props.ings) {
		burger = (
			<Aux>
				<Burger ingredients={props.ings} />
				<BuildControls
					ingredientAdded={props.onIngredientAdded}
					ingredientRemoved={props.onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(props.ings)}
					price={props.price}
					ordered={purchasehandler}
					isAuth={props.isAuthenticated}
				/>
			</Aux>
		);
		orderSummary = (
			<OrderSummary
				ingredients={props.ings}
				purchaseCancelled={purchaseCancelhandler}
				purchaseContinued={purchaseContinuehandler}
				price={props.price}
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

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) =>
			dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) =>
			dispatch(actions.setAuthRedirectPath(path)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorhandler(burgerBuilder, axios));
