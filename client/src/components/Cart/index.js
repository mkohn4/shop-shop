import React from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { useEffect } from 'react';
import { idbPromise } from '../../utils/helpers';
import {QUERY_CHECKOUT} from '../../utils/queries';
import {loadStripe} from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {

    const [state, dispatch] = useStoreContext();

    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({type: ADD_MULTIPLE_TO_CART, products: [...cart]});
        };

        if (!state.cart.length) {
            getCart();
        }
        //hook only runs again if length of state.cart changes
    }, [state.cart.length, dispatch]);

    function toggleCart() {
        dispatch({type: TOGGLE_CART});
    }

    function calculateTotal() {
        let sum=0;
        state.cart.forEach(item => {
            sum+= item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    //stripe checkout functionality - START

    //data variable will contain checkout session after query is called with getCheckout()
    const [getCheckout, {data}] = useLazyQuery(QUERY_CHECKOUT);

    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({sessionId: data.checkout.session});
            })
        }
    }, [data]);

    function submitCheckout() {
        //create empty array for all product ids to pass to stripe
        const productIds=[];
        //in state cart object, for each item
        state.cart.forEach((item) => {
            for (let i=0; i<item.purchaseQuantity; i++) {
                //add the product id to the productIds array for each time its been added to cart (2x of 1 item = 2 product ids)
                productIds.push(item._id);
            }
        });

        getCheckout({
            variables: {products: productIds}
        });
    }

        //stripe checkout functionality - END


    if (!state.cartOpen) {
        return (
            <div className='cart-closed' onClick={toggleCart}>
                <span role="img" aria-label="cart">🛒</span>
            </div>
        )
    }

    return (
        <div className="cart">
            <div className='close' onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {state.cart.length ? (
                <div>
                    {state.cart.map(item => (
                        <CartItem key={item._id} item={item}/>

                    ))}
                    <div className='flex-row space-between'>
                        <strong>Total: ${calculateTotal}</strong>
                        {
                            Auth.loggedIn() ?
                                <button onClick={submitCheckout}>Checkout</button>
                                :
                                <span>(login to check out)</span>
                        }
                    </div>
                </div>
            ) : (
                <h3>
                <span role="img" aria-label="shocked">
                  😱
                </span>
                You haven't added anything to your cart yet!
              </h3>
            )}

        </div>
    )
}

export default Cart;