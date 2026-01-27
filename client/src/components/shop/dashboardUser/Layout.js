import React, { Fragment, createContext, useReducer, useEffect } from "react";
import Sidebar from "./Sidebar";
import UserNavber from "./UserNavber";
import {
  dashboardUserState,
  dashboardUserReducer,
} from "./DashboardUserContext";
import { fetchData } from "./Action";

export const DashboardUserContext = createContext();

const Layout = ({ children }) => {
  const [data, dispatch] = useReducer(dashboardUserReducer, dashboardUserState);

  useEffect(() => {
    fetchData(dispatch);
  }, []);

  return (
    <Fragment>
      <DashboardUserContext.Provider value={{ data, dispatch }}>
        <div className="min-h-screen flex overflow-hidden h-screen bg-white">
            {/* Sidebar Section */}
            <div className="w-2/12 h-screen flex-shrink-0 border-r border-gray-200 hidden md:block">
                <Sidebar />
            </div>
            
            {/* Main Content Sections */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar Section */}
                <div className="flex-shrink-0 border-b border-gray-200 bg-white z-10">
                    <UserNavber />
                </div>
                
                {/* Main Display Area */}
                <section className="flex-1 overflow-auto relative bg-gray-50/30">
                    <div className="p-4 md:p-8 min-h-full flex flex-col">
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </DashboardUserContext.Provider>
    </Fragment>
  );
};

export default Layout;
