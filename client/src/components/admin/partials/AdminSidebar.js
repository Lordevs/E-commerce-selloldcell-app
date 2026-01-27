import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

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
  const [user, setUser] = useState({
    name: "Administrator",
    email: "admin@lordevs.com",
    role: "Admin"
  });

  useEffect(() => {
    const fetchData = async () => {
        const jwt = localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")) : null;
        const uId = jwt?.user?._id;
        
        if (uId) {
            try {
                // Direct axios call to ensure no import/path issues
                const res = await axios.post(`${apiURL}/api/user/signle-user`, { uId });
                if (res.data && res.data.User) {
                    setUser({
                        name: res.data.User.name,
                        email: res.data.User.email,
                        role: res.data.User.userRole === 1 ? "Administrator" : "User"
                    });
                }
            } catch (error) {
                console.log("Error fetching user data:", error);
            }
        }
    };
    fetchData();
  }, []);

  return (
    <Fragment>
      <div
        id="sidebar"
        className="flex flex-col w-full h-full bg-white transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex justify-center p-6 border-b border-gray-100">
             <div 
                onClick={() => history.push("/admin/dashboard")}
                className="cursor-pointer hover:scale-105 transition-transform duration-300 flex items-center justify-center w-full"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="Lordevs Logo"
                  className="h-12 w-auto object-contain"
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
                label="Shipping & Tax"
                active={location.pathname === "/admin/dashboard/shipping-tax"}
                onClick={() => history.push("/admin/dashboard/shipping-tax")}
            />
          </nav>

          {/* User Section at bottom */}
          <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
                  {user.name ? user.name[0] : 'A'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-600 truncate uppercase tracking-tighter leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold truncate lowercase leading-tight">
                      {user.email}
                    </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminSidebar;
