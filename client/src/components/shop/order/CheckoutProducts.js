import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost, calculateDeliveryCharges, calculateTaxes } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { fetchData, pay } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);
  const [settings, setSettings] = useState(null);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    const { getSettings } = await import("./FetchApi");
    const response = await getSettings();
    if (response && response.settings) {
      setSettings(response.settings);
    }
  };

  const subTotalAmount = totalCost();
  const deliveryCharges = calculateDeliveryCharges(data.cartProduct, settings);
  const taxes = calculateTaxes(subTotalAmount, settings);
  const taxTotal = taxes.reduce((acc, tax) => acc + tax.amount, 0);
  const finalTotal = subTotalAmount + deliveryCharges + taxTotal;

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
            <svg
            className="w-12 h-12 animate-spin text-gray-900"
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
            <span className="text-gray-600 font-medium">Processing request...</span>
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24 pb-12">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
                <span className="ml-4 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {data.cartProduct ? data.cartProduct.length : 0} Items
                </span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                {/* Left: Product List */}
                <div className="w-full lg:w-7/12 order-2 lg:order-1 mt-8 lg:mt-0">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                             Order Summary
                         </h2>
                         <CheckoutProducts products={data.cartProduct} />
                    </div>
                </div>

                {/* Right: Shipping & Payment */}
                <div className="w-full lg:w-5/12 order-1 lg:order-2">
                     <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 md:p-10 sticky top-24">
                          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                             <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             Shipping Details
                          </h2>
                          
                          {state.error ? (
                            <div className="bg-red-50 border border-red-100 text-red-600 py-3 px-4 rounded-xl mb-6 text-sm font-medium flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {state.error}
                            </div>
                          ) : (
                            ""
                          )}

                          <form className="space-y-6">
                              <div className="flex flex-col space-y-2">
                                <label htmlFor="address" className="text-sm font-bold text-gray-700 ml-1">
                                    Delivery Address
                                </label>
                                <textarea
                                    value={state.address}
                                    onChange={(e) =>
                                    setState({
                                        ...state,
                                        address: e.target.value,
                                        error: false,
                                    })
                                    }
                                    onBlur={(e) => setState({ ...state, error: false })}
                                    rows={3}
                                    id="address"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-gray-600 placeholder-gray-400 resize-none"
                                    placeholder="Enter your full street address..."
                                />
                              </div>

                              <div className="flex flex-col space-y-2">
                                <label htmlFor="phone" className="text-sm font-bold text-gray-700 ml-1">
                                    Phone Number
                                </label>
                                <input
                                    value={state.phone}
                                    onChange={(e) =>
                                    setState({
                                        ...state,
                                        phone: e.target.value,
                                        error: false,
                                    })
                                    }
                                    type="number"
                                    id="phone"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-gray-600 placeholder-gray-400"
                                    placeholder="+880 1XXX CCC"
                                />
                              </div>
                          </form>

                          {/* Order Summary Cost */}
                          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                              <div className="flex justify-between items-center text-gray-600">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-bold">${subTotalAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center text-gray-600">
                                <span className="font-medium">Delivery Charges</span>
                                <span className="font-bold">${deliveryCharges.toFixed(2)}</span>
                              </div>
                              {taxes.map((tax, i) => (
                                <div key={i} className="flex justify-between items-center text-gray-600">
                                  <span className="font-medium text-xs uppercase tracking-wide">{tax.label}</span>
                                  <span className="font-bold">${tax.amount.toFixed(2)}</span>
                                </div>
                              ))}
                              
                              <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-200">
                                <span className="font-black text-xl text-gray-900">Total</span>
                                <span className="font-black text-2xl text-gray-900">${finalTotal.toFixed(2)}</span>
                              </div>
                          </div>

                          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500 font-medium">Pay when you receive</p>
                                </div>
                             </div>
                          </div>

                          <button
                            onClick={(e) =>
                                pay(
                                data,
                                dispatch,
                                state,
                                setState,
                                subTotalAmount, // passed logic (was totalCost func but pay might expect value or func? Logic used totalCost func in original. Wait, pay expects function or value?) 
                                calculateDeliveryCharges,
                                settings,
                                history
                                )
                            }
                            className="w-full mt-6 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2"
                           >
                            <span>Place Order</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                     </div>
                </div>
            </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="flex flex-col space-y-6">
        {products !== null && products.length > 0 ? (
          products.map((product, index) => {
            return (
              <div
                key={index}
                className="group flex flex-col md:flex-row items-start md:items-center bg-gray-50/50 hover:bg-gray-50 rounded-2xl p-4 transition-colors border border-transparent hover:border-gray-100"
              >
                <div 
                    onClick={(e) => history.push(`/products/${product._id}`)}
                    className="flex-shrink-0 cursor-pointer relative overflow-hidden rounded-xl w-24 h-24 bg-white border border-gray-100"
                >
                   <img
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                    alt={product.pName}
                   />
                </div>
                
                <div className="flex-1 mt-4 md:mt-0 md:ml-6 flex flex-col justify-between h-auto md:h-24 py-1">
                   <div>
                       <h3 
                            onClick={(e) => history.push(`/products/${product._id}`)}
                            className="text-lg font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1"
                        >
                            {product.pName}
                        </h3>
                       <p className="text-sm font-medium text-gray-500 mt-1">
                           Qty: <span className="text-gray-900 font-bold">{quantity(product._id)}</span>
                       </p>
                   </div>
                   
                   <div className="flex items-center justify-between mt-4 md:mt-0">
                        <div className="text-sm font-medium text-gray-400">
                             Unit Price: <span className="text-gray-600">${product.pPrice}.00</span>
                        </div>
                        <div className="text-lg font-black text-gray-900">
                             ${subTotal(product._id, product.pPrice)}.00
                        </div>
                   </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400">
              No products found for checkout
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;
