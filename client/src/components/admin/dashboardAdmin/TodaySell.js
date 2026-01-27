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
      <div className="col-span-1 overflow-auto bg-white shadow-xl rounded-2xl p-6 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Today's Orders
            </h2>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {data.totalOrders.Orders !== undefined ? ordersList().length : 0} Live Orders
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-400 text-sm uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Shipping Address</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.totalOrders.Orders !== undefined && ordersList().length > 0 ? (
                ordersList().map((item, key) => {
                  return <TodayOrderTable order={item} key={key} />;
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0H4" />
                        </svg>
                      </div>
                      <p className="text-xl font-medium text-gray-400 tracking-tight">No orders found for today</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-400 italic">
            Showing latest {data.totalOrders.Orders !== undefined ? ordersList().length : 0} updates
          </p>
          <button
            onClick={(e) => history.push("/admin/dashboard/orders")}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl active:scale-95"
          >
            <span>View All Activity</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </Fragment>
  );
};

const TodayOrderTable = ({ order }) => {
  return (
    <Fragment>
      <tr className="bg-white hover:bg-gray-50 transition-colors duration-200 group shadow-sm rounded-xl overflow-hidden hover:shadow-md">
        <td className="px-6 py-4 rounded-l-xl">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-4 overflow-hidden">
              {order.allProduct.map((item, index) => {
                return (
                  <img
                    key={index}
                    className="inline-block h-12 w-12 rounded-lg ring-2 ring-white object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                    src={`${apiURL}/uploads/products/${item.id.pImages[0]}`}
                    alt="Product"
                  />
                );
              })}
            </div>
            <div className="flex flex-col">
              {order.allProduct.map((item, index) => (
                <span key={index} className="text-sm font-bold text-gray-800 leading-tight text-wrap">
                  {item.id.pName} <span className="text-gray-400 font-medium whitespace-nowrap">x{item.quantitiy}</span>
                </span>
              ))}
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          {order.status === "Not processed" && (
            <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
               {order.status}
            </span>
          )}
          {order.status === "Processing" && (
            <span className="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-600 text-xs font-bold rounded-full border border-yellow-100">
               <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 rotate-45 animate-spin text-wrap"></span>
               {order.status}
            </span>
          )}
          {order.status === "Shipped" && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
               {order.status}
            </span>
          )}
          {order.status === "Delivered" && (
            <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
               {order.status}
            </span>
          )}
          {order.status === "Cancelled" && (
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
               <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
               {order.status}
            </span>
          )}
        </td>
        <td className="px-6 py-4 border-b">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 max-w-[200px] truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all duration-300">
              {order.address}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 border-b">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{moment(order.createdAt).format("hh:mm A")}</span>
            <span className="text-xs text-gray-400 capitalize">{moment(order.createdAt).fromNow()}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-right rounded-r-xl border-b">
           <button className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
           </button>
        </td>
      </tr>
    </Fragment>
  );
};

const TodaySell = (props) => {
  return (
    <div className="">
      <SellTable />
    </div>
  );
};

export default TodaySell;
