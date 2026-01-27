import React, { Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";

const SidebarItem = ({ icon, label, active, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`group flex items-center p-4 cursor-pointer transition-all duration-300 ${
                active 
                ? "bg-gray-100 text-gray-900 border-r-4 border-gray-900" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
            <span className={`mr-4 transition-colors duration-300 ${active ? "text-gray-900" : "group-hover:text-gray-900"}`}>
                {icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
};

const AdminSidebar = (props) => {
  const location = useLocation();
  const history = useHistory();

  return (
    <Fragment>
      <div
        id="sidebar"
        className="flex flex-col w-full h-full bg-white transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex justify-center py-8 border-b border-gray-100">
             <div 
                onClick={() => history.push("/admin/dashboard")}
                className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="L"
                  className="w-8 h-8 object-contain brightness-0 invert"
                />
             </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 mt-4">
            <SidebarItem
                icon={<svg className="w-6 h-6 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                label="Dashboard"
                active={location.pathname === "/admin/dashboard"}
                onClick={() => history.push("/admin/dashboard")}
            />
            <SidebarItem
                icon={<svg className="w-6 h-6 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                label="Categories"
                active={location.pathname === "/admin/dashboard/categories"}
                onClick={() => history.push("/admin/dashboard/categories")}
            />
            <SidebarItem
                icon={<svg className="w-6 h-6 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
                label="Products"
                active={location.pathname === "/admin/dashboard/products"}
                onClick={() => history.push("/admin/dashboard/products")}
            />
            <SidebarItem
                icon={<svg className="w-6 h-6 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                label="Orders"
                active={location.pathname === "/admin/dashboard/orders"}
                onClick={() => history.push("/admin/dashboard/orders")}
            />
            <SidebarItem
                icon={<svg className="w-6 h-6 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="Settings"
                active={location.pathname === "/admin/dashboard/shipping-tax"}
                onClick={() => history.push("/admin/dashboard/shipping-tax")}
            />
          </nav>

          {/* User Section at bottom */}
          <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
                  A
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate">Administrator</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase italic tracking-tighter">Master Control</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminSidebar;
