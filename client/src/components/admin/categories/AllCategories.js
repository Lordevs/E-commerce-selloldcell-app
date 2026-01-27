import React, { Fragment, useContext, useEffect } from "react";
import { getAllCategory, deleteCategory } from "./FetchApi";
import { CategoryContext } from "./index";
import moment from "moment";

const apiURL = process.env.REACT_APP_API_URL;

const AllCategory = (props) => {
  const { data, dispatch } = useContext(CategoryContext);
  const { categories, loading } = data;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    let responseData = await getAllCategory();
    setTimeout(() => {
      if (responseData && responseData.Categories) {
        dispatch({
          type: "fetchCategoryAndChangeState",
          payload: responseData.Categories,
        });
        dispatch({ type: "loading", payload: false });
      }
    }, 1000);
  };

  const deleteCategoryReq = async (cId) => {
    let deleteC = await deleteCategory(cId);
    if (deleteC.error) {
      console.log(deleteC.error);
    } else if (deleteC.success) {
      console.log(deleteC.success);
      fetchData();
    }
  };

  const editCategory = (cId, type, des, status) => {
    if (type) {
      dispatch({
        type: "editCategoryModalOpen",
        cId: cId,
        des: des,
        status: status,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-400">Synchronizing Classifications...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories && categories.length > 0 ? (
          categories.map((item, key) => (
            <CategoryCard
              category={item}
              editCat={(cId, type, des, status) => editCategory(cId, type, des, status)}
              deleteCat={(cId) => deleteCategoryReq(cId)}
              key={key}
            />
          ))
        ) : (
          <div className="col-span-full py-40 rounded-[3.5rem] bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-100 shadow-inner">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">No Inventory Classes Found</p>
          </div>
        )}
      </div>
      
      {/* Footer Summary */}
      <div className="mt-12 p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-[2.5rem]">
          <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Master Database Sync: Stable</span>
          </div>
          <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Inventory Volume</span>
              <span className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-[10px] font-black tracking-tighter">
                {categories?.length || 0} TOTAL CLASSES
              </span>
          </div>
      </div>
    </Fragment>
  );
};

const CategoryCard = ({ category, deleteCat, editCat }) => {
  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 flex flex-col overflow-hidden active:scale-95">
      
      {/* Top Image Section */}
      <div className="relative h-64 overflow-hidden bg-gray-50 border-b border-gray-50">
        <img
          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
          src={`${apiURL}/uploads/categories/${category.cImage}`}
          alt=""
        />
        
        {/* Status Badge Over Image */}
        <div className="absolute top-6 left-6">
            {category.cStatus === "Active" ? (
              <span className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl text-[9px] font-black text-emerald-600 uppercase tracking-widest shadow-xl">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span>Production</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl text-[9px] font-black text-rose-600 uppercase tracking-widest shadow-xl">
                 <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                 <span>Offline</span>
              </span>
            )}
        </div>

        {/* Action Overlay (Hidden until hover) */}
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center space-x-4">
             <button
                onClick={() => editCat(category._id, true, category.cDescription, category.cStatus)}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-900 hover:bg-emerald-500 hover:text-white hover:rotate-12 transition-all duration-300 shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </button>
             <button
                onClick={() => deleteCat(category._id)}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-900 hover:bg-rose-500 hover:text-white hover:-rotate-12 transition-all duration-300 shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-1 bg-white">
          <div className="mb-4">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] block mb-1">REG#{category._id.slice(-6).toUpperCase()}</span>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic group-hover:text-indigo-600 transition-colors">{category.cName}</h3>
          </div>
          
          <p className="text-xs text-gray-400 font-bold leading-relaxed line-clamp-2 italic mb-auto">
             {category.cDescription}
          </p>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Modified</span>
                  <span className="text-[10px] font-black text-gray-900 uppercase italic">{moment(category.updatedAt).fromNow()}</span>
              </div>
              <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover:bg-indigo-500 transition-colors"></div>
                   <span className="text-[9px] font-black text-gray-300 uppercase italic">Master File</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AllCategory;
