import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { DashboardContext } from "./";
import { todayAllOrders } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

const SellTable = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    todayAllOrders(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ordersList = () => {
    let newList = [];
    if (data.totalOrders.Orders !== undefined) {
      data.totalOrders.Orders.forEach(function (elem) {
        if (moment(elem.createdAt).format("LL") === moment().format("LL")) {
          newList = [...newList, elem];
        }
      });
    }
    return newList;
  };

  return (
    <Fragment>
      <div className="bg-white border-t border-gray-100 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Live Deliveries
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>{ordersList().length} New Activity</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-white">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 italic">Items & Quantity</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 italic">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 italic">Destination</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 italic text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.totalOrders.Orders !== undefined && ordersList().length > 0 ? (
                ordersList().map((item, key) => {
                  return <TodayOrderRow order={item} key={key} />;
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-30">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0H4" />
                      </svg>
                      <p className="text-xs font-bold uppercase tracking-widest">No activity reported yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-50 bg-white">
          <button
            onClick={(e) => history.push("/admin/dashboard/orders")}
            className="w-full py-3 text-[10px] font-bold text-center uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all rounded-lg"
          >
            Show All Logged Activities
          </button>
        </div>
      </div>
    </Fragment>
  );
};

const TodayOrderRow = ({ order }) => {
  const statusStyles = {
    "Not processed": "bg-red-50 text-red-600 border-red-100",
    "Processing": "bg-amber-50 text-amber-600 border-amber-100",
    "Shipped": "bg-blue-50 text-blue-600 border-blue-100",
    "Delivered": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Cancelled": "bg-gray-50 text-gray-400 border-gray-100",
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {order.allProduct.slice(0, 3).map((item, index) => (
              <img
                key={index}
                className="w-8 h-8 rounded-lg ring-2 ring-white object-cover"
                src={`${apiURL}/uploads/products/${item.id.pImages[0]}`}
                alt=""
              />
            ))}
            {order.allProduct.length > 3 && (
                <div className="w-8 h-8 rounded-lg ring-2 ring-white bg-gray-900 border flex items-center justify-center text-[10px] text-white font-bold">
                    +{order.allProduct.length - 3}
                </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-600 leading-none mb-1">
                {order.allProduct[0].id.pName} {order.allProduct.length > 1 ? ` & ${order.allProduct.length - 1} more` : ''}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                QTY: {order.allProduct.reduce((acc, curr) => acc + curr.quantitiy, 0)}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded ${statusStyles[order.status] || statusStyles["Not processed"]}`}>
            {order.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs text-gray-500 font-medium truncate max-w-[150px] inline-block">
          {order.address}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-gray-600 tabular-nums">{moment(order.createdAt).format("HH:mm")}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{moment(order.createdAt).fromNow()}</span>
        </div>
      </td>
    </tr>
  );
};

const TodaySell = (props) => {
  return (
    <div className="mt-8">
      <SellTable />
    </div>
  );
};

export default TodaySell;
