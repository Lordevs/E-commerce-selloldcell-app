import React, { Fragment, useEffect, useContext } from "react";
import moment from "moment";
import { fetchOrderByUser } from "./Action";
import Layout, { DashboardUserContext } from "./Layout";

const apiURL = process.env.REACT_APP_API_URL;

const TableHeader = () => {
  return (
    <Fragment>
      <thead>
        <tr>
          <th className="px-6 py-4 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Products</th>
          <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
          <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Address</th>
          <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction Id</th>
          <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ordered On</th>
          <th className="px-6 py-4 bg-gray-50 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status Updated</th>
        </tr>
      </thead>
    </Fragment>
  );
};

const TableBody = ({ order }) => {
    
  const getStatusBadge = (status) => {
      switch (status) {
          case "Not processed":
              return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800">Not Processed</span>;
          case "Processing":
              return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-800">Processing</span>;
          case "Shipped":
              return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800">Shipped</span>;
          case "Delivered":
              return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">Delivered</span>;
          case "Cancelled":
              return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800">Cancelled</span>;
          default:
              return <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-800">{status}</span>;
      }
  };

  return (
    <Fragment>
      <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-col space-y-2">
            {order.allProduct.map((product, i) => {
                return (
                <div className="flex items-center space-x-3" key={i}>
                    <img
                    className="h-10 w-10 rounded-lg object-cover object-center border border-gray-100 shadow-sm"
                    src={`${apiURL}/uploads/products/${product.id.pImages[0]}`}
                    alt="productImage"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 line-clamp-1 max-w-[150px]">{product.id.pName}</span>
                        <span className="text-xs text-gray-500 font-medium">{product.quantitiy}x</span>
                    </div>
                </div>
                );
            })}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {getStatusBadge(order.status)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-900">
          ${order.amount}.00
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 font-medium">{order.phone}</td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 font-medium max-w-xs truncate" title={order.address}>{order.address}</td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-mono text-gray-500 bg-gray-50 rounded p-1">
          {order.transactionId}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
          {moment(order.createdAt).format("MMM Do YY")}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
          {moment(order.updatedAt).format("MMM Do YY")}
        </td>
      </tr>
    </Fragment>
  );
};

const OrdersComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const { OrderByUser: orders } = data;

  useEffect(() => {
    fetchOrderByUser(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="w-full md:w-9/12 flex items-center justify-center py-24">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }
  return (
    <Fragment>
      <div className="flex flex-col w-full my-4 md:my-0 md:px-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order History</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wide">
                {orders ? orders.length : 0} Orders
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {orders && orders.length > 0 ? (
                  orders.map((item, i) => {
                    return <TableBody key={i} order={item} />;
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12"
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          <span className="text-lg font-medium text-gray-500">No orders found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const UserOrders = (props) => {
  return (
    <Fragment>
      <Layout children={<OrdersComponent />} />
    </Fragment>
  );
};

export default UserOrders;
