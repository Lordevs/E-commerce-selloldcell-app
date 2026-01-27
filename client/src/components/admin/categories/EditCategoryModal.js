import React, { Fragment, useContext, useState, useEffect } from "react";
import { CategoryContext } from "./index";
import { editCategory, getAllCategory } from "./FetchApi";

const EditCategoryModal = (props) => {
  const { data, dispatch } = useContext(CategoryContext);

  const [des, setDes] = useState("");
  const [status, setStatus] = useState("");
  const [cId, setCid] = useState("");

  useEffect(() => {
    setDes(data.editCategoryModal.des || "");
    setStatus(data.editCategoryModal.status || "");
    setCid(data.editCategoryModal.cId || "");
  }, [data.editCategoryModal.modal, data.editCategoryModal.des, data.editCategoryModal.status, data.editCategoryModal.cId]);

  const fetchData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: responseData.Categories,
      });
    }
  };

  const submitForm = async () => {
    dispatch({ type: "loading", payload: true });
    let edit = await editCategory(cId, des, status);
    if (edit.error) {
      console.log(edit.error);
      dispatch({ type: "loading", payload: false });
    } else if (edit.success) {
      dispatch({ type: "editCategoryModalClose" });
      setTimeout(() => {
        fetchData();
        dispatch({ type: "loading", payload: false });
      }, 500);
    }
  };

  return (
    <Fragment>
      <div
        onClick={(e) => dispatch({ type: "editCategoryModalClose" })}
        className={`${
          data.editCategoryModal.modal ? "" : "hidden"
        } fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500`}
      />

      <div
        className={`${
          data.editCategoryModal.modal ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        } fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500`}
      >
        <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
            <div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic text-emerald-600">Sync <span className="text-gray-900">Configuration</span></h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Update classification operational logic</p>
            </div>
            <button
                onClick={(e) => dispatch({ type: "editCategoryModalClose" })}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="relative z-10 p-10 space-y-8">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic">System Hash code</span>
                    <span className="px-5 py-2.5 bg-gray-50 text-gray-900 rounded-2xl border border-gray-100 font-mono text-xs font-black shadow-inner">
                        {cId?.toString().toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic" htmlFor="status">Status Optimization</label>
              <select
                value={status}
                name="status"
                onChange={(e) => setStatus(e.target.value)}
                className="px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-black text-gray-900 appearance-none italic uppercase tracking-widest"
                id="status"
              >
                <option value="Active">Operational Status</option>
                <option value="Disabled">Deactivated Status</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic" htmlFor="description">Logic Update</label>
              <textarea
                value={des}
                onChange={(e) => setDes(e.target.value)}
                placeholder="Modify categorization scope..."
                className="px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-medium text-gray-500 min-h-[150px] italic"
                name="description"
                id="description"
              />
            </div>
            
            <div className="pt-2">
              <button
                onClick={(e) => submitForm()}
                disabled={data.loading}
                className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl shadow-gray-200 hover:-translate-y-2 active:scale-95 flex items-center justify-center space-x-4"
              >
                {data.loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <Fragment>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>Rewrite Matrix File</span>
                    </Fragment>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditCategoryModal;
