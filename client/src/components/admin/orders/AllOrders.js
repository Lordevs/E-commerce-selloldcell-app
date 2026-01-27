import React, { Fragment, useContext, useEffect } from "react";
import moment from "moment";

import { OrderContext } from "./index";
import { fetchData, editOrderReq, deleteOrderReq } from "./Actions";

const apiURL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) || 'http://localhost:8000';

const AllOrders = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const { orders, loading } = data;

  useEffect(() => {
    fetchData(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Orders...</span>
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <div className="col-span-1 bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50 pointer-events-none"></div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic border-b border-gray-100">
                        <th className="px-6 py-6 font-medium">Product Details</th>
                        <th className="px-6 py-6 font-medium text-center">Status</th>
                        <th className="px-6 py-6 font-medium text-center">Amount</th>
                        <th className="px-6 py-6 font-medium text-center">Transaction</th>
                        <th className="px-6 py-6 font-medium text-center">Customer</th>
                        <th className="px-6 py-6 font-medium text-center">Contact</th>
                        <th className="px-6 py-6 font-medium text-left">Address</th>
                        <th className="px-6 py-6 font-medium text-center">Timeline</th>
                        <th className="px-6 py-6 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {orders && orders.length > 0 ? (
                        orders.map((item, i) => (
                            <OrderRow
                                key={i}
                                order={item}
                                editOrder={(oId, type, status) => editOrderReq(oId, type, status, dispatch)}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center justify-center opacity-50">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No orders found</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-between items-center rounded-b-[3rem]">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Total Records</span>
            <span className="text-sm font-bold text-gray-600">{orders ? orders.length : 0} orders</span>
        </div>
      </div>
    </Fragment>
  );
};

/* Single Order Component */
const OrderRow = ({ order, editOrder }) => {
  const { dispatch } = useContext(OrderContext);

  const calculateDeliveryCharges = () => {
    if (!order.allProduct || order.allProduct.length === 0) return 0;
    let total = 0;
    order.allProduct.forEach((product) => {
      if (product && product.id) {
        total += (product.id.pDeliveryCharges || 0) * (product.quantitiy || 1);
      }
    });
    return total;
  };

  const totalDelivery = calculateDeliveryCharges();
  
  const getStatusColor = (status) => {
      switch(status) {
          case 'Not processed': return 'bg-rose-50 text-rose-600 border-rose-100';
          case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-100';
          case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
          case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
          case 'Cancelled': return 'bg-gray-50 text-gray-500 border-gray-100';
          default: return 'bg-gray-50 text-gray-600';
      }
  }

  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* Products */}
      <td className="px-6 py-6 align-top">
        <div className="flex flex-col space-y-3">
            {order.allProduct && order.allProduct.length > 0 ? (
                order.allProduct.map((product, i) => {
                    if (!product.id) return null;
                    return (
                        <div key={i} className="flex items-start space-x-3">
                            <img
                                className="w-10 h-10 rounded-xl object-contain bg-gray-50 border border-gray-100"
                                src={`${apiURL}/uploads/products/${product.id.pImages?.[0] || "default.jpg"}`}
                                alt="prod"
                            />
                            <div className="flex flex-col pt-0.5">
                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight line-clamp-1 max-w-[140px]">{product.id.pName}</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.quantitiy} Units</span>
                            </div>
                        </div>
                    );
                })
            ) : <span className="text-xs text-gray-300 italic">Empty</span>}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-6 align-top text-center">
        <span className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
            {order.status}
        </span>
      </td>

      {/* Amount + Delivery */}
      <td className="px-6 py-6 align-top text-center">
        <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-800">${order.amount}.00</span>
            {totalDelivery > 0 && (
                <span className="text-[9px] font-bold text-emerald-600 mt-1">+${totalDelivery} Ship</span>
            )}
        </div>
      </td>

      {/* Transaction Info */}
      <td className="px-6 py-6 align-top text-center">
        <div className="flex flex-col items-center space-y-1">
            <span className="px-2 py-1 rounded bg-gray-100 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                {order.paymentMethod || "COD"}
            </span>
            <span className="text-[9px] font-mono text-gray-400 max-w-[100px] truncate" title={order.transactionId}>
                {order.transactionId || "N/A"}
            </span>
        </div>
      </td>

      {/* Customer Info */}
      <td className="px-6 py-6 align-top text-center">
        <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-700">{order.user?.name || "Guest"}</span>
            <span className="text-[9px] font-medium text-gray-400 mt-0.5">{order.user?.email}</span>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-6 align-top text-center">
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-600">{order.phone || "N/A"}</span>
        </div>
      </td>

      {/* Address */}
      <td className="px-6 py-6 align-top">
        <p className="text-[10px] font-medium text-gray-500 leading-relaxed line-clamp-2 w-48" title={order.address}>
            {order.address || "N/A"}
        </p>
      </td>

      {/* Dates */}
      <td className="px-6 py-6 align-top text-center">
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-700 uppercase">{moment(order.createdAt).format("MMM Do")}</span>
            <span className="text-[9px] text-gray-400 mt-0.5">{moment(order.createdAt).format("h:mm a")}</span>
            {moment(order.updatedAt).isAfter(order.createdAt) && (
                <span className="text-[8px] text-emerald-500 font-bold uppercase mt-1">Updated</span>
            )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-6 align-top text-center">
        <div className="flex flex-row justify-center space-x-2">
            <button 
                onClick={() => editOrder(order._id, true, order.status)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all hover:shadow-md"
                title="Update Status"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button 
                onClick={() => deleteOrderReq(order._id, dispatch)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all hover:shadow-md"
                title="Delete Order"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
      </td>
    </tr>
  );
};

export default AllOrders;
