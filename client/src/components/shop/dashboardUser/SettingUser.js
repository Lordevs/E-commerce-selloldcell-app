import React, { Fragment, useState, useContext } from "react";
import Layout from "./Layout";
import { handleChangePassword } from "./Action";
import { DashboardUserContext } from "./Layout";

const SettingComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);

  const [fData, setFdata] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    success: false,
    error: false,
    passwordView: false,
    type: "password",
  });

  if (fData.success || fData.error) {
    setTimeout(() => {
      setFdata({ ...fData, success: false, error: false });
    }, 1500);
  }

  if (data.loading) {
    return (
      <div className="w-full md:w-9/12 flex items-center justify-center ">
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
      <div className="flex flex-col w-full my-4 md:my-0 md:w-9/12 md:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gray-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Change Password</h2>
          </div>
          
          <div className="flex flex-col space-y-6">
            {fData.success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {fData.success}
              </div>
            ) : (
              ""
            )}
            {fData.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {fData.error}
              </div>
            ) : (
              ""
            )}
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="oldPassword" className="text-sm font-bold text-gray-700 ml-1">Old Password</label>
              <div className="relative">
                <input
                  onChange={(e) =>
                    setFdata({ ...fData, oldPassword: e.target.value })
                  }
                  value={fData.oldPassword}
                  type={fData.type}
                  id="oldPassword"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-gray-600 placeholder-gray-400"
                  placeholder="Old Password"
                />
                
                <div 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={(e) =>
                        setFdata({
                          ...fData,
                          passwordView: !fData.passwordView,
                          type: fData.passwordView ? "password" : "text",
                        })
                    }
                >
                    {fData.passwordView ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                <label htmlFor="newPassword" className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                <input
                    onChange={(e) =>
                    setFdata({ ...fData, newPassword: e.target.value })
                    }
                    value={fData.newPassword}
                    type="password"
                    id="newPassword"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-gray-600 placeholder-gray-400"
                    placeholder="New Password"
                />
                </div>
                <div className="flex flex-col space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
                <input
                    onChange={(e) =>
                    setFdata({ ...fData, confirmPassword: e.target.value })
                    }
                    value={fData.confirmPassword}
                    type="password"
                    id="confirmPassword"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-gray-600 placeholder-gray-400"
                    placeholder="Confirm Password"
                />
                </div>
            </div>
            
            <div className="pt-4">
                <button
                onClick={(e) => handleChangePassword(fData, setFdata, dispatch)}
                className="w-full md:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                Change password
                </button>
            </div>
            
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const SettingUser = (props) => {
  return (
    <Fragment>
      <Layout children={<SettingComponent />} />
    </Fragment>
  );
};

export default SettingUser;
