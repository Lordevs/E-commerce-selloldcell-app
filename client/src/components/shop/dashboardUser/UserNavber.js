import React, { Fragment, useContext } from "react";
import { useHistory } from "react-router-dom";
import { logout } from "./Action";
import { DashboardUserContext } from "./Layout";

const UserNavber = (props) => {
  const history = useHistory();
  const { data } = useContext(DashboardUserContext);

  return (
    <Fragment>
      <nav className="flex items-center justify-between px-8 py-4 bg-white transition-all duration-300 border-b border-gray-200">
        {/* Page Title */}
        <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tighter uppercase italic">
                {history.location.pathname.split('/').pop() === "dashboard" ? "Dashboard" : history.location.pathname.split('/').pop().replace(/-/g, ' ')}
            </h1>  
        </div>
            
        {/* Right Actions */}
        <div className="flex items-center space-x-6">
          {/* Shop Button */}
          <button 
            onClick={() => history.push("/")}
            className="hidden md:flex items-center space-x-2 px-6 py-2 bg-gray-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>View Shop</span>
          </button>

          {/* User & Logout */}
          <div className="flex items-center space-x-2">
            <div className="md:hidden">
               {/* Mobile User Icon if needed, or stick to sidebar */}
            </div>
            
            <button 
              onClick={() => logout()}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Sign Out"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default UserNavber;
