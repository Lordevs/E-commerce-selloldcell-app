import React, { Fragment, useContext, useEffect, useState } from "react";
import { getAllProduct, deleteProduct } from "./FetchApi";
import moment from "moment";
import { ProductContext } from "./index";

const apiURL = process.env.REACT_APP_API_URL;

const AllProduct = () => {
  const { data, dispatch } = useContext(ProductContext);
  const { products } = data;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let responseData = await getAllProduct();
    if (responseData && responseData.Products) {
        dispatch({
            type: "fetchProductsAndChangeState",
            payload: responseData.Products,
        });
    }
    setLoading(false);
  };

  const deleteProductReq = async (pId) => {
    let deleteC = await deleteProduct(pId);
    if (deleteC.error) {
      console.log(deleteC.error);
    } else if (deleteC.success) {
      fetchData();
    }
  };

  const editProduct = (pId, product, type) => {
    if (type) {
      dispatch({
        type: "editProductModalOpen",
        product: { ...product, pId: pId },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gray-900/10 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="bg-white min-h-full">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.3em] font-mono">
                {products?.length || 0} {products?.length === 1 ? 'Asset' : 'Assets'} IN PRODUCTION
            </h3>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Image</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Product</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Description</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Category</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Price</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Stock</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Size</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Property</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Offer</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100">Created At</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-gray-100 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {products && products.length > 0 ? (
                        products.map((item, key) => (
                            <tr key={key} className="group hover:bg-gray-50/30 transition-all">
                                {/* Image */}
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm shrink-0">
                                        <img 
                                            src={`${apiURL}/uploads/products/${item.pImages[0]}`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            alt={item.pName} 
                                        />
                                    </div>
                                </td>

                                {/* Product */}
                                <td className="px-6 py-4">
                                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-tight group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                                        {item.pName}
                                    </span>
                                </td>

                                {/* Description */}
                                <td className="px-6 py-4">
                                    <p className="text-[10px] text-gray-500 font-medium tracking-tight lowercase line-clamp-1 max-w-[150px]">
                                        {item.pDescription}
                                    </p>
                                </td>

                                {/* Category */}
                                <td className="px-6 py-4 text-center">
                                     <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-lg whitespace-nowrap">
                                        {item.pCategory?.cName}
                                     </span>
                                </td>

                                {/* Price */}
                                <td className="px-6 py-4">
                                     <span className="text-[10px] font-semibold text-gray-700 tracking-tighter">
                                        ${item.pPrice}
                                     </span>
                                </td>

                                {/* Stock */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-row items-center space-x-1">
                                        <span className={`text-[10px] font-semibold ${item.pQuantity <= 5 ? 'text-rose-500' : 'text-gray-700'}`}>
                                            {item.pQuantity}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">Units</span>
                                    </div>
                                </td>

                                {/* Size */}
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
                                        {item.pSize}
                                    </span>
                                </td>

                                {/* Property */}
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
                                        {item.pProperty}
                                    </span>
                                </td>

                                {/* Offer */}
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-semibold text-rose-500 tracking-tighter">
                                        {item.pOffer}%
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.pStatus === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`}></div>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${item.pStatus === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {item.pStatus}
                                        </span>
                                    </div>
                                </td>

                                {/* Created At */}
                                <td className="px-6 py-4">
                                    <span className="text-[10px] text-gray-500 font-mono font-semibold uppercase whitespace-nowrap">
                                        {moment(item.createdAt).format("DD MMM YY")}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-1">
                                        <button
                                            onClick={() => editProduct(item._id, item, true)}
                                            className="w-5 h-5 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-900 hover:text-white transition-all transform active:scale-90"
                                            title="Edit"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => deleteProductReq(item._id)}
                                            className="w-5 h-5 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-rose-500 hover:text-white transition-all transform active:scale-90"
                                            title="Delete"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="px-6 py-20 text-center">
                                <p className="text-xl font-bold text-gray-900 tracking-tighter uppercase italic">Neutral State Detected</p>
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2 italic">Zero assets synchronized</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
      <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Total Records</span>
            <span className="text-sm font-bold text-gray-600">{products ? products.length : 0} products</span>
        </div>
    </Fragment>
  );
};

export default AllProduct;
