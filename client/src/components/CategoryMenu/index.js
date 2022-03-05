import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import {useStoreContext} from '../../utils/GlobalState';
import {idbPromise} from '../../utils/helpers';

function CategoryMenu() {

  //get current state from global state
  const [state, dispatch] = useStoreContext();
  //destructure categories out of global state because its all we need here
  const {categories} = state;
  //get category data by querying db with QUERY_CATEGORIES
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  //when component loads and categoryData is now defined, dispatch sets categoryData to global state
  //function runs on load to update global state
  //when useQuery finishes and data exists in categoryData, useEffect runs again and notices categoryData exists
  //then it executes dispatch() function
  useEffect(() => {
    //if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      //execute our dispatch function with our action object to indicate
      //type of action and data to set our state for categories to
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  },[categoryData, loading, dispatch])

  //update click handler to update global state
  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };
  
  //const categories = categoryData?.categories || [];

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
