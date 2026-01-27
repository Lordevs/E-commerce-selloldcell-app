import React, { Fragment, useContext, useEffect } from "react";
import { getAllCategory, deleteCategory } from "./FetchApi";
import { CategoryContext } from "./index";
import moment from "moment";

const apiURL = process.env.REACT_APP_API_URL;

const AllCategory = () => {
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
      fetchData();
    }
  };

  const editCategory = (cId, type, des, status, cImage, name) => {
    if (type) {
      dispatch({
        type: "editCategoryModalOpen",
        cId: cId,
        des: des,
        status: status,
        cImage: cImage,
        name: name,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="bg-white border text-left border-gray-100 min-h-full rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50 pointer-events-none"></div>
        
        <div className="overflow-x-auto p-8 text-left">
             <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic border-b border-gray-100">
                        <th className="px-6 py-6 font-medium text-left">Category Details</th>
                        <th className="px-6 py-6 font-medium text-center">Status</th>
                        <th className="px-6 py-6 font-medium text-center">Created At</th>
                        <th className="px-6 py-6 font-medium text-center">Last Updated</th>
                        <th className="px-6 py-6 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {categories && categories.length > 0 ? (
                      categories.map((item, key) => (
                        <tr key={key} className="hover:bg-gray-50/80 transition-colors group">
                            {/* Details */}
                            <td className="px-6 py-6 align-top text-left">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm shrink-0">
                                        <img
                                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                          src={`${apiURL}/uploads/categories/${item.cImage}`}
                                          alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs font-bold text-gray-800 uppercase tracking-tight">{item.cName}</span>
                                        <span className="text-[10px] text-gray-600 font-medium leading-relaxed line-clamp-1 max-w-xs">{item.cDescription}</span>
                                    </div>
                                </div>
                            </td>
                            
                            {/* Status */}
                            <td className="px-6 py-6 align-top text-center">
                                {item.cStatus === "Active" ? (
                                  <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                     Online
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg text-[9px] font-bold uppercase tracking-widest opacity-60">
                                     Offline
                                  </span>
                                )}
                            </td>

                            {/* Created At */}
                            <td className="px-6 py-6 align-top text-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">{moment(item.createdAt).format("MMM Do YY")}</span>
                                </div>
                            </td>

                            {/* Timestamp */}
                            <td className="px-6 py-6 align-top text-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">{moment(item.updatedAt).format("MMM Do YY")}</span>
                                    <span className="text-[9px] font-medium text-gray-600 mt-0.5">{moment(item.updatedAt).fromNow()}</span>
                                </div>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-6 align-top text-center">
                                <div className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => editCategory(item._id, true, item.cDescription, item.cStatus, item.cImage, item.cName)}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all transform active:scale-95"
                                        title="Edit Category"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => deleteCategoryReq(item._id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all transform active:scale-95"
                                        title="Delete Category"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                          <td colSpan="5" className="px-6 py-20 text-center">
                              <div className="flex flex-col items-center justify-center opacity-30">
                                  <p className="text-[11px] font-bold uppercase tracking-[0.4em]">No Categories Found</p>
                              </div>
                          </td>
                      </tr>
                    )}
                </tbody>
             </table>
        </div>

        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Total Records</span>
            <span className="text-sm font-bold text-gray-600">{categories ? categories.length : 0} categories</span>
        </div>
      </div>
    </Fragment>
  );
};

export default AllCategory;
