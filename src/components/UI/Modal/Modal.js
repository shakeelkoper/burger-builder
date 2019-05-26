import React, { Component } from 'react';
import classes from './Modal.css';
import AUX from '../../../hoc/AUX/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  shouldComponentUpdate(nextprops, nextState){
    return nextprops.show !== this.props.show;
  }
  render(){
    return(
      <AUX>
        <div 
          className={classes.Modal}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0'
          }}>
          {this.props.children}
        </div>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
      </AUX>
    );
  }
}

export default Modal;