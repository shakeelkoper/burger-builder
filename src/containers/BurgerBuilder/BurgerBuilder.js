import React, {Component} from 'react';
import Aux from '../../hoc/AUX/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorhandler from '../../hoc/withErrorHandler/withErrorhandler'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  beef:0.7
};

class BurgerBuilder extends Component{

  state = {
    ingredients : null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount (){
      axios.get("https://react-my-burger-74d41.firebaseio.com/ingredients.json")
        .then( response => {
          this.setState({ingredients: response.data});
        })
        .catch(error => {
          this.setState({error: true});
        });
  }

  updatePurchaseState () {
    const ingredients = {
      ...this.state.ingredients
    }
    const sum = Object.keys( ingredients )
        .map( igKey => {
            return ingredients[igKey];
        } )
        .reduce( ( sum, el ) => {
            return sum + el;
        }, 0 );
    this.setState( { purchasable: sum > 0 } );
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice =  this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients}, function () {
      this.updatePurchaseState();
    });
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0){
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice =  this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients},function(){
      this.updatePurchaseState();
    });
  }

  purchasehandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelhandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinuehandler = () => {
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'shakeel koper',
        address: {
          street: 'Test Street 1',
          zipcode: '54321',
          country: 'india'
        },
        email: 'test@test.com',
      },
      deliveryMethod: 'fastest',
    }
    // alert('you Continue!');
    axios.post('/orders.json',order)
    .then(response => {
      console.log(response);
      this.setState({loading: false, purchasing: false});
    })
    .catch(error => {
      console.log(error);
      this.setState({loading: false, purchasing: false });
    });

  }

  render(){
    const disabledInfo = {
      ...this.state.ingredients
    };
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if(this.state.ingredients){
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={this.purchasehandler}/>
        </Aux>
      );
      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients} 
        purchaseCancelled={this.purchaseCancelhandler}
        purchaseContinued={this.purchaseContinuehandler}
        price={this.state.totalPrice.toFixed(2)}
        />
    }
    if(this.state.loading){
      orderSummary = <Spinner />;
    }
    

    return(
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelhandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorhandler(BurgerBuilder, axios);