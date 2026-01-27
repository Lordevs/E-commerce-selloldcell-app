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
      fetchData();
    }
  };

  const editCategory = (cId, type, des, status, cImage) => {
    if (type) {
      dispatch({
        type: "editCategoryModalOpen",
        cId: cId,
        des: des,
        status: status,
        cImage: cImage,
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
      <div className="bg-white border-t border-gray-100 min-h-full">
        <div className="flex items-center justify-between py-6 mb-4">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] font-mono">
                {categories?.length || 0} {categories?.length === 1 ? 'Category' : 'Categories'} IN PRODUCTION
            </h3>
        </div>

        <div className="flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-12 px-8 py-4 bg-gray-50/50 border-b border-gray-100">
                <div className="col-span-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification Details</div>
                <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</div>
                <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Updated</div>
                <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right px-2">Action</div>
            </div>

            {categories && categories.length > 0 ? (
              categories.map((item, key) => (
                <div key={key} className="grid grid-cols-12 px-8 py-8 border-b border-gray-50 hover:bg-gray-50/20 transition-all items-center group">
                    {/* Details */}
                    <div className="col-span-4 flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm shrink-0">
                            <img
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                              src={`${apiURL}/uploads/categories/${item.cImage}`}
                              alt=""
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-black text-gray-900 tracking-tight uppercase italic">{item.cName}</span>
                            <span className="text-[11px] text-gray-400 font-medium leading-relaxed italic line-clamp-1 max-w-xs">{item.cDescription}</span>
                        </div>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-3">
                        {item.cStatus === "Active" ? (
                          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                             <span>Online</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-60">
                             <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                             <span>Offline</span>
                          </div>
                        )}
                    </div>

                    {/* Timestamp */}
                    <div className="col-span-3 flex flex-col">
                        <span className="text-xs font-black text-gray-900 tabular-nums lowercase italic">{moment(item.updatedAt).format("DD MMM, YYYY")}</span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">{moment(item.updatedAt).fromNow()}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end space-x-2">
                        <button
                            onClick={() => editCategory(item._id, true, item.cDescription, item.cStatus, item.cImage)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all transform active:scale-90"
                            title="Edit Master Matrix"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                            onClick={() => deleteCategoryReq(item._id)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-500 hover:text-white transition-all transform active:scale-90"
                            title="Purge Classification"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
              ))
            ) : (
              <div className="py-32 flex flex-col items-center justify-center opacity-30">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em]">Zero Classifications Found</p>
              </div>
            )}
        </div>
      </div>
    </Fragment>
  );
};

export default AllCategory;
