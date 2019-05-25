import React from 'react';
import classes from './Modal.css';
import AUX from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

const modal = (props) => (
  <AUX>
    <div 
      className={classes.Modal}
      style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1' : '0'
      }}>
      {props.children}
    </div>
    <Backdrop show={props.show} clicked={props.modalClosed}/>
  </AUX>
);

export default modal;