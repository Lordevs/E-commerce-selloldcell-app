import React, { Fragment, useContext } from "react";
import { CategoryContext } from "./index";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoryMenu = (props) => {
  const { dispatch } = useContext(CategoryContext);

  return (
    <Fragment>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Inventory Categories</h2>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Manage and organize your product catalog</p>
        </div>
        <button
            onClick={() => dispatch({ type: "addCategoryModal", payload: true })}
            className="flex items-center space-x-3 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 shadow-xl shadow-gray-200"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Category</span>
        </button>
      </div>
      <AddCategoryModal />
      <EditCategoryModal />
    </Fragment>
  );
};

export default CategoryMenu;
