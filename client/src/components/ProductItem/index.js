import React from "react";
import { Link } from "react-router-dom";
import { pluralize, idbPromise } from "../../utils/helpers"
import {useStoreContext} from '../../utils/GlobalState';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY} from '../../utils/actions';


function ProductItem(item) {
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const [state, dispatch] = useStoreContext();

  const {cart} = state;

  const addToCart = () => {
    //find cart item with the matching id and return true if true
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
    //if theres a match, call update with a new purchase quantity
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        //why is this both _id and the detail page is just id?
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity)+1
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: {...item, purchaseQuantity: 1}
      });
      idbPromise('cart', 'put', {...item, purchaseQuantity: 1});
    }
 
  };


  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
