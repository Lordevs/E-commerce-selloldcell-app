import React, { Fragment, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { DashboardUserContext } from "./Layout";

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

const Sidebar = (props) => {
  const { data } = useContext(DashboardUserContext);
  const history = useHistory();
  const location = useLocation();

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full bg-white border-r border-gray-200 transition-all duration-300">
        <div className="flex flex-col h-full">
           {/* Logo Section */}
           <div className="flex justify-center p-6 border-b border-gray-100">
             <div 
                className="cursor-pointer hover:scale-105 transition-transform duration-300 flex items-center justify-center w-full"
                onClick={() => history.push("/")}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
             </div>
          </div>

          <nav className="flex-1 mt-6 overflow-y-auto">
            <SidebarItem 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                label="My Orders"
                active={location.pathname === "/user/orders"}
                onClick={() => history.push("/user/orders")}
            />
             <SidebarItem 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                label="My Profile"
                active={location.pathname === "/user/profile"}
                onClick={() => history.push("/user/profile")}
            />
            <SidebarItem 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                label="Wishlist"
                active={location.pathname === "/wish-list"}
                onClick={() => history.push("/wish-list")}
            />
             <SidebarItem 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                label="Settings"
                active={location.pathname === "/user/setting"}
                onClick={() => history.push("/user/setting")}
            />
          </nav>

          {/* User Section at bottom */}
          <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
                  {data.userDetails ? data.userDetails.name[0] : 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-600 truncate uppercase tracking-tighter leading-tight">
                      {data.userDetails ? data.userDetails.name : "User"}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold truncate lowercase leading-tight">
                      {data.userDetails ? data.userDetails.email : ""}
                    </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
