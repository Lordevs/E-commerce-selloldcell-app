import React, { Fragment, useContext, useState, useEffect } from "react";
import Layout from "./Layout";
import { DashboardUserContext } from "./Layout";
import { updatePersonalInformationAction } from "./Action";

const ProfileComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const userDetails = data.userDetails !== null ? data.userDetails : "";

  const [fData, setFdata] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    success: false,
  });

  useEffect(() => {
    setFdata({
      ...fData,
      id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phoneNumber,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const handleSubmit = () => {
    updatePersonalInformationAction(dispatch, fData);
  };

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
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Personal Information</h2>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Name</label>
                    <input
                        onChange={(e) => setFdata({ ...fData, name: e.target.value })}
                        value={fData.name}
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-gray-600 placeholder-gray-400"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">Email</label>
                    <input
                        value={fData.email}
                        readOnly
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed font-medium select-none"
                    />
                    <span className="text-xs text-gray-400 ml-1 font-medium">
                        Email cannot be changed
                    </span>
                </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="number" className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
              <input
                onChange={(e) => setFdata({ ...fData, phone: e.target.value })}
                value={fData.phone}
                type="number"
                id="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-gray-600 placeholder-gray-400"
              />
            </div>
            
            <div className="pt-4">
                <button
                onClick={(e) => handleSubmit()}
                className="w-full md:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                Update Information
                </button>
            </div>
            
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const UserProfile = (props) => {
  return (
    <Fragment>
      <Layout children={<ProfileComponent />} />
    </Fragment>
  );
};

export default UserProfile;
