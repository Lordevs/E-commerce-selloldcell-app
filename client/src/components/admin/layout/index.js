import React, { Fragment } from "react";
import AdminNavber from "../partials/AdminNavber";
import AdminSidebar from "../partials/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <Fragment>
      <div className="min-h-screen flex overflow-hidden h-screen bg-white">
        {/* Sidebar Section */}
        <div className="w-2/12 h-screen flex-shrink-0 border-r border-gray-200">
          <AdminSidebar />
        </div>
        
        {/* Main Content Sections */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar Section */}
          <div className="flex-shrink-0 border-b border-gray-200">
            <AdminNavber />
          </div>
          
          {/* Main Display Area */}
          <section className="flex-1 overflow-auto relative">
            <div className="p-4 md:p-8 min-h-full flex flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminLayout;
