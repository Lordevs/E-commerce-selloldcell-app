import React, { Fragment, createContext, useReducer } from "react";
import AdminLayout from "../layout";
import ProductMenu from "./ProductMenu";
import ProductTable from "./ProductTable";
import { productState, productReducer } from "./ProductContext";

/* This context manage all of the products component's data */
export const ProductContext = createContext();

const ProductComponent = () => {
  return (
    <div className="flex flex-col space-y-8 bg-white min-h-screen">
      <ProductMenu />
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <ProductTable />
      </div>
    </div>
  );
};

const Products = (props) => {
  /* To use useReducer make sure that reducer is the first arg */
  const [data, dispatch] = useReducer(productReducer, productState);

  return (
    <Fragment>
      <ProductContext.Provider value={{ data, dispatch }}>
        <AdminLayout children={<ProductComponent />} />
      </ProductContext.Provider>
    </Fragment>
  );
};

export default Products;
