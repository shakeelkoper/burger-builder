import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import axios from "../../../axios-orders";
import classes from "./ContactData.css";
class ContactData extends Component {
	state = {
		name: "",
		email: "",
		address: {
			street: "",
			postalCode: "",
		},
		loading: false,
	};
	orderHandler = (event) => {
		event.preventDefault();
		console.log(this.props.ingredients);
		this.setState({ loading: true });
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			customer: {
				name: "shakeel koper",
				address: {
					street: "Test Street 1",
					zipcode: "54321",
					country: "india",
				},
				email: "test@test.com",
			},
			deliveryMethod: "fastest",
		};
		// alert('you Continue!');
		axios
			.post("/orders.json", order)
			.then((response) => {
				console.log(response);
				this.setState({ loading: false });
				this.props.history.push("/");
			})
			.catch((error) => {
				console.log(error);
				this.setState({ loading: false });
			});
	};
	render() {
		let form = (
			<form>
				<input
					className={classes.Input}
					type="text"
					name="name"
					placeholder="you Name"
				/>
				<input
					className={classes.Input}
					type="email"
					name="email"
					placeholder="you Mail"
				/>
				<input
					className={classes.Input}
					type="text"
					name="street"
					placeholder="Street"
				/>
				<input
					className={classes.Input}
					type="text"
					name="postal"
					placeholder="Postal Code"
				/>
				<Button btnType="Success" clicked={this.orderHandler}>
					Order
				</Button>
			</form>
		);
		if (this.state.loading) {
			form = <Spinner />;
		}
		return (
			<div className={classes.ContactData}>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		);
	}
}

export default ContactData;
