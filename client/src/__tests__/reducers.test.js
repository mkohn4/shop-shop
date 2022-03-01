//import actions
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from '../utils/actions';
import { reducer } from '../utils/reducers';

//create a sample of what our globsal state will look like
const initialState = {
    products: [],
    categories: [{name: 'Food'}],
    currentCategory: '1',
    cart: [
        {
            _id: '1',
            name: 'Soup',
            purchaseQuantity: 1
        },
        {
            _id: '2',
            name: 'Bread',
            purchaseQuantity: 2
        },
    ],
    cartOpen: false
};

//test updating products list
test('UPDATE_PRODUCTS', () => {
    let newState = reducer(initialState, {
        type: UPDATE_PRODUCTS,
        products: [{},{}]
    });

    expect(newState.products.length).toBe(2);
    expect(initialState.products.length).toBe(0);
})

//test updating categories
test('UPDATE_CATEGORIES', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CATEGORIES,
        categories: [{},{}]
    });

    expect(newState.categories.length).toBe(2);
    expect(initialState.categories.length).toBe(1);
})

//test updating current category
test('UPDATE_CURRENT_CATEGORY', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CURRENT_CATEGORY,
        currentCategory: '2'
    });

    expect(newState.currentCategory).toBe('2');
    expect(initialState.currentCategory).toBe('1');
})

//test adding to cart
test('ADD_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_TO_CART,
        product: {purchaseQuantity: 1}
    });

    expect(newState.cart.length).toBe(3);
    expect(initialState.cart.length).toBe(2);
})

//Add multiple items to a cart
test('ADD_MULTIPLE_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_MULTIPLE_TO_CART,
        products: [{},{}]
    });

    expect(newState.cart.length).toBe(4);
    expect(initialState.cart.length).toBe(2);
})

//test removing from cart
test('REMOVE_FROM_CART', () => {
    let newState1 = reducer(initialState, {
        type: REMOVE_FROM_CART,
        _id: '1'
    });

    //cart is still open
    expect(newState1.cartOpen).toBe(true);

    //second item should now be first item
    expect(newState1.cart.length).toBe(1);
    expect(newState1.cart[0]._id).toBe('2');

    let newState2 = reducer(newState1, {
        type: REMOVE_FROM_CART,
        _id: '2'
    });

    //cart is now empty and closed
    expect(newState2.cartOpen).toBe(false);
    expect(newState2.cart.length).toBe(0);
    expect(initialState.cart.length).toBe(2);
})

//test updating the cart quanity
test('UPDATE_CART_QUANTITY', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CART_QUANTITY,
        _id: '1',
        purchaseQuantity: 3
    });

    expect(newState.cartOpen).toBe(true);
    expect(newState.cart[0].purchaseQuantity).toBe(3);
    expect(newState.cart[1].purchaseQuantity).toBe(2);

    expect(initialState.cartOpen).toBe(false);
});

//test clearing the cart
test('CLEAR_CART', () => {
    let newState = reducer(initialState, {
        type: CLEAR_CART
    });

    expect(newState.cartOpen).toBe(false);
    expect(newState.cart.length).toBe(0);
    expect(initialState.cart.length).toBe(2);
})

//test cart visibility toggle
test('TOGGLE_CART', () => {
    let newState = reducer(initialState, {
        type: TOGGLE_CART
    });

    expect(newState.cartOpen).toBe(true);
    expect(initialState.cartOpen).toBe(false);

    let newState2 = reducer(newState, {
        type: TOGGLE_CART
    });

    expect(newState2.cartOpen).toBe(false);
})