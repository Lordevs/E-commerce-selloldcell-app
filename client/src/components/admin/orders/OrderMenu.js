import React, { Fragment, useState, useContext } from "react";
import { OrderContext } from "./index";
import UpdateOrderModal from "./UpdateOrderModal";
import SearchFilter from "./SearchFilter";
import { filterOrder } from "./Actions";

const OrderMenu = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const [dropdown, setDropdown] = useState(false);
  return (
    <Fragment>
      <div className="col-span-1 flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase italic">Order Management</h2>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Track and manage customer orders</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          
          <div className="relative group/filter z-20">
            <div
              onClick={(e) => setDropdown(!dropdown)}
              className="flex items-center cursor-pointer bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <svg
                className="w-4 h-4 text-gray-600 mr-2 group-hover/filter:text-emerald-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest group-hover/filter:text-gray-900">Filter Orders</span>
            </div>
            
            <div
              className={`${
                dropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
              } absolute top-full right-0 mt-4 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden w-64 flex flex-col transition-all duration-300`}
            >
              {[
                { label: "All Orders", value: "All" },
                { label: "Pending Processing", value: "Not processed" },
                { label: "Processing", value: "Processing" },
                { label: "Shipped", value: "Shipped" },
                { label: "Delivered", value: "Delivered" },
                { label: "Cancelled", value: "Cancelled" }
              ].map((item, index) => (
                <span
                  key={index}
                  onClick={(e) => {
                    filterOrder(item.value, data, dispatch, dropdown, setDropdown);
                    setDropdown(false);
                  }}
                  className="px-8 py-4 hover:bg-emerald-50 hover:text-emerald-600 text-gray-600 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors border-b last:border-0 border-gray-50 flex items-center justify-between group/item"
                >
                  {item.label}
                  {data.orderList?.every(o => o.status === item.value) && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto">
            <SearchFilter />
          </div>
        </div>
        
        <UpdateOrderModal />
      </div>
    </Fragment>
  );
};

export default OrderMenu;
