import React, { Fragment, useContext, useState, useEffect } from "react";
import { OrderContext } from "./index";
import { getAllOrder, editCategory } from "./FetchApi";

const UpdateOrderModal = (props) => {
  const { data, dispatch } = useContext(OrderContext);

  const [status, setStatus] = useState("");
  const [oId, setOid] = useState("");

  useEffect(() => {
    setOid(data.updateOrderModal.oId);
    setStatus(data.updateOrderModal.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.updateOrderModal.modal]);

  const fetchData = async () => {
    let responseData = await getAllOrder();
    if (responseData.Orders) {
      dispatch({
        type: "fetchOrderAndChangeState",
        payload: responseData.Orders,
      });
    }
  };

  const submitForm = async () => {
    dispatch({ type: "loading", payload: true });
    let responseData = await editCategory(oId, status);
    if (responseData.error) {
      dispatch({ type: "loading", payload: false });
    } else if (responseData.success) {
      console.log(responseData.success);
      dispatch({ type: "updateOrderModalClose" });
      fetchData();
      dispatch({ type: "loading", payload: false });
    }
  };

  return (
    <Fragment>
      <div
        className={`${
          data.updateOrderModal.modal ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        } fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500`}
      >
        <div 
            onClick={(e) => dispatch({ type: "updateOrderModalClose" })}
            className="absolute inset-0 bg-white/60 backdrop-blur-md transition-opacity"
        ></div>

        <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col border border-gray-100 overflow-hidden z-10">
            
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900 uppercase tracking-tighter italic">Update Order Status</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Modify lifecycle stage</span>
                </div>
                <button 
                    onClick={(e) => dispatch({ type: "updateOrderModalClose" })}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:shadow-md transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="p-8 flex flex-col space-y-6">
                <div className="flex flex-col space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic">Select New Status</label>
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 appearance-none italic uppercase tracking-widest cursor-pointer"
                        >
                            <option value="Not processed">Not processed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                          onClick={(e) => submitForm()}
                          className="w-full py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2"
                    >
                        <span>Update Status</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                </div>
            </div>
            
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateOrderModal;
