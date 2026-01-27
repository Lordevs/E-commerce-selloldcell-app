import React, { Fragment, useContext } from "react";
import { ProductContext } from "./index";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

const ProductMenu = (props) => {
  const { dispatch } = useContext(ProductContext);
  return (
    <Fragment>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase italic">Inventory Assets</h2>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Manage and organize your product catalog</p>
        </div>
        <button
            onClick={() => dispatch({ type: "addProductModal", payload: true })}
            className="mt-4 md:mt-0 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200 hover:-translate-y-1 active:scale-95 flex items-center space-x-3"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            <span>Create New Asset</span>
        </button>
      </div>

      <AddProductModal />
      <EditProductModal />
    </Fragment>
  );
};

export default ProductMenu;
