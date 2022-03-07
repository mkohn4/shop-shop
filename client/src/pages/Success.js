import React, {useEffect} from 'react';
import {useMutation} from '@apollo/client';
import Jumbotron from '../components/Jumbotron';
import {ADD_ORDER} from '../../src/utils/mutations';
import {idbPromise} from '../utils/helpers';

function Success() {

    const [addOrder] = useMutation(ADD_ORDER);

    useEffect(() => {
        async function saveOrder() {
            //get items from cart in indexeddb
            const cart = await idbPromise('cart', 'get');
            //get array of product ids from cart
            const products = cart.map(item => item._id);
            //if there are products
            if (products.length) {
                //use mutation to call addOrder transaction
                const {data} = await addOrder({variables: {products}});
                //assign productData to response from DB
                const productData = data.addOrder.products;
                //for each item added, delete it from indexeddb since its been bought
                productData.forEach((item) => {
                    idbPromise('cart','delete', item);
                })
            }
        }
        //call function
        saveOrder();
        //in 3 seconds, redirect user to homepage
        setTimeout(() => {
            window.location.assign('/');
         }, 3000);
    }, [addOrder]);

    return (
        <div>
            <Jumbotron>
                <h1>Success!</h1>
                <h2>
                    Thank you for your purchase!
                </h2>
                <h2>
                    You will now be redirected to the homepage
                </h2>
            </Jumbotron>
        </div>
    )
};

export default Success;