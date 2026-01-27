import React, { Fragment, useContext, useEffect } from "react";
import { DashboardContext } from "./";
import { GetAllData } from "./Action";

const DashboardCard = (props) => {
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    GetAllData(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {/* Card Start */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customers Card */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customers</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {data ? data.totalData.Users : 0}
              </h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
            <span>View Details</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        {/* Orders Card */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Orders</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {data ? data.totalData.Orders : 0}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600 font-medium">
            <span>Manage Orders</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        {/* Products Card */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Products</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {data ? data.totalData.Products : 0}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
            <span>Inventory</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>

        {/* Categories Card */}
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Categories</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {data ? data.totalData.Categories : 0}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600 font-medium">
            <span>Setup Categories</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>
      {/* End Card */}
    </Fragment>
  );
};

export default DashboardCard;
