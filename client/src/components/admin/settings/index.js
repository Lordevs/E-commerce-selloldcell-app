import React, { Fragment, useState, useEffect } from "react";
import AdminLayout from "../layout";
import { getSettings, updateSettings } from "./FetchApi";

const ShippingTaxComponent = () => {
    const [fData, setFdata] = useState({
        baseDeliveryCharge: 0,
        extraItemCharge: 0,
        taxes: [],
        success: false,
        error: false,
    });

    const [isEditingDelivery, setIsEditingDelivery] = useState(false);
    const [isEditingTaxes, setIsEditingTaxes] = useState(false);

    // For adding/editing taxes
    const [newTax, setNewTax] = useState({ label: "", percentage: "" });
    const [editTaxIndex, setEditTaxIndex] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let responseData = await getSettings();
        if (responseData && responseData.settings) {
            setFdata({
                ...fData,
                baseDeliveryCharge: responseData.settings.baseDeliveryCharge,
                extraItemCharge: responseData.settings.extraItemCharge,
                taxes: responseData.settings.taxes,
            });
        }
    };

    const handleDeliveryUpdate = async (e) => {
        e.preventDefault();
        let responseData = await updateSettings({
            baseDeliveryCharge: fData.baseDeliveryCharge,
            extraItemCharge: fData.extraItemCharge,
            taxes: fData.taxes,
        });
        if (responseData && responseData.success) {
            setIsEditingDelivery(false);
            setFdata(prev => ({ ...prev, success: "Delivery charges updated successfully", error: false }));
            setTimeout(() => setFdata(prev => ({ ...prev, success: false })), 2000);
        } else if (responseData && responseData.error) {
            setFdata(prev => ({ ...prev, error: responseData.error, success: false }));
            setTimeout(() => setFdata(prev => ({ ...prev, error: false })), 2000);
        }
    };

    const handleTaxesUpdate = async () => {
        let responseData = await updateSettings({
            baseDeliveryCharge: fData.baseDeliveryCharge,
            extraItemCharge: fData.extraItemCharge,
            taxes: fData.taxes,
        });
        if (responseData && responseData.success) {
            setIsEditingTaxes(false);
            setFdata(prev => ({ ...prev, success: "Tax configuration updated successfully", error: false }));
            setTimeout(() => setFdata(prev => ({ ...prev, success: false })), 2000);
        } else if (responseData && responseData.error) {
            setFdata(prev => ({ ...prev, error: responseData.error, success: false }));
            setTimeout(() => setFdata(prev => ({ ...prev, error: false })), 2000);
        }
    };

    const addOrUpdateTax = () => {
        if (newTax.label && newTax.percentage) {
            let updatedTaxes = [...fData.taxes];
            if (editTaxIndex !== null) {
                updatedTaxes[editTaxIndex] = { ...newTax, percentage: parseFloat(newTax.percentage) };
                setEditTaxIndex(null);
            } else {
                updatedTaxes.push({ ...newTax, percentage: parseFloat(newTax.percentage) });
            }
            setFdata({ ...fData, taxes: updatedTaxes });
            setNewTax({ label: "", percentage: "" });
        }
    };

    const removeTax = (index) => {
        const updatedTaxes = fData.taxes.filter((_, i) => i !== index);
        setFdata({ ...fData, taxes: updatedTaxes });
    };

    const startEditTax = (index) => {
        setEditTaxIndex(index);
        setNewTax({
            label: fData.taxes[index].label,
            percentage: fData.taxes[index].percentage
        });
    };

    return (
        <div className="grid grid-cols-1 space-y-6 p-4">
            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-2xl font-bold text-gray-800">Shipping & Taxation Management</h2>
            </div>

            {fData.success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-sm">{fData.success}</div>}
            {fData.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm">{fData.error}</div>}

            {/* Delivery Charges Section */}
            <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">Delivery Charges</h3>
                    {!isEditingDelivery ? (
                        <button
                            onClick={() => setIsEditingDelivery(true)}
                            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-all flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit Delivery
                        </button>
                    ) : (
                        <div className="space-x-2">
                            <button
                                onClick={handleDeliveryUpdate}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => { setIsEditingDelivery(false); fetchData(); }}
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-500 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-600">Base Delivery Charge ($)</label>
                        <input
                            disabled={!isEditingDelivery}
                            type="number"
                            value={fData.baseDeliveryCharge}
                            onChange={(e) => setFdata({ ...fData, baseDeliveryCharge: e.target.value })}
                            className={`border p-3 rounded-md focus:ring-2 focus:ring-gray-800 focus:outline-none transition-all ${!isEditingDelivery ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
                        />
                        <p className="text-xs text-gray-400 italic">Charged for the first item in the cart.</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-600">Additional Item Charge ($)</label>
                        <input
                            disabled={!isEditingDelivery}
                            type="number"
                            value={fData.extraItemCharge}
                            onChange={(e) => setFdata({ ...fData, extraItemCharge: e.target.value })}
                            className={`border p-3 rounded-md focus:ring-2 focus:ring-gray-800 focus:outline-none transition-all ${!isEditingDelivery ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
                        />
                        <p className="text-xs text-gray-400 italic">Added for each additional item beyond the first.</p>
                    </div>
                </div>
            </div>

            {/* Taxes Section */}
            <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">Taxes Configuration</h3>
                    {!isEditingTaxes ? (
                        <button
                            onClick={() => setIsEditingTaxes(true)}
                            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-all flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit Taxes
                        </button>
                    ) : (
                        <div className="space-x-2">
                            <button
                                onClick={handleTaxesUpdate}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                            >
                                Save Tax Config
                            </button>
                            <button
                                onClick={() => { setIsEditingTaxes(false); setEditTaxIndex(null); setNewTax({ label: "", percentage: "" }); fetchData(); }}
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-500 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {isEditingTaxes && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-dashed border-gray-300">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">{editTaxIndex !== null ? 'Update Existing Tax' : 'Add New Tax'}</h4>
                        <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex flex-col space-y-1 w-full md:w-1/3">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Tax Label</label>
                                <input
                                    type="text"
                                    value={newTax.label}
                                    onChange={(e) => setNewTax({ ...newTax, label: e.target.value })}
                                    className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                                    placeholder="e.g. VAT"
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full md:w-1/3">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Percentage (%)</label>
                                <input
                                    type="number"
                                    value={newTax.percentage}
                                    onChange={(e) => setNewTax({ ...newTax, percentage: e.target.value })}
                                    className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
                                    placeholder="0.00"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addOrUpdateTax}
                                className="w-full md:w-auto bg-gray-700 text-white px-6 py-2 rounded hover:bg-black transition-all"
                            >
                                {editTaxIndex !== null ? 'Update' : 'Add Tax'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                                <th className="pb-3 font-medium">Tax Label</th>
                                <th className="pb-3 font-medium">Percentage</th>
                                <th className="pb-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {fData.taxes.length > 0 ? fData.taxes.map((tax, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-4 font-medium text-gray-700">{tax.label}</td>
                                    <td className="py-4 text-gray-600">{tax.percentage}%</td>
                                    <td className="py-4 text-right space-x-2">
                                        {isEditingTaxes && (
                                            <Fragment>
                                                <button
                                                    onClick={() => startEditTax(index)}
                                                    className="text-blue-500 hover:text-blue-700 p-1"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => removeTax(index)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </Fragment>
                                        )}
                                        {!isEditingTaxes && <span className="text-gray-300 text-xs italic">Edit enabled above</span>}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="py-8 text-center text-gray-400">No taxes configured yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ShippingTax = () => {
    return (
        <AdminLayout>
            <ShippingTaxComponent />
        </AdminLayout>
    );
};

export default ShippingTax;
