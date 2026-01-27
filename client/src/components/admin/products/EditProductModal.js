import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { editProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

const EditProductModal = (props) => {
  const { data, dispatch } = useContext(ProductContext);

  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [customSize, setCustomSize] = useState("");

  const [fData, setFdata] = useState({
    pId: "",
    pName: "",
    pDescription: "",
    pImages: [],
    pEditImages: null,
    pStatus: "",
    pCategory: "",
    pQuantity: "",
    pPrice: "",
    pOffer: "",
    pDeliveryCharges: "",
    pSize: "",
    pProperty: "",
    error: false,
    success: false,
  });

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      setCategories(responseData.Categories);
    }
  };

  useEffect(() => {
    let size = data.editProductModal.pSize || "";
    let isOther = size && !["5 ml", "10 ml", "20 ml", "50 ml"].includes(size);

    setFdata({
      pId: data.editProductModal.pId,
      pName: data.editProductModal.pName,
      pDescription: data.editProductModal.pDescription,
      pImages: data.editProductModal.pImages,
      pStatus: data.editProductModal.pStatus,
      pCategory: typeof data.editProductModal.pCategory === 'object' && data.editProductModal.pCategory !== null && data.editProductModal.pCategory._id
        ? data.editProductModal.pCategory._id
        : data.editProductModal.pCategory || "",
      pQuantity: data.editProductModal.pQuantity,
      pPrice: data.editProductModal.pPrice,
      pOffer: data.editProductModal.pOffer,
      pDeliveryCharges: data.editProductModal.pDeliveryCharges || 0,
      pSize: isOther ? "Other" : size,
      pProperty: data.editProductModal.pProperty || "",
      error: false,
      success: false
    });

    if (isOther) {
      setCustomSize(size.replace(" ml", ""));
    } else {
      setCustomSize("");
    }
    setPreviews([]);
  }, [data.editProductModal]);

  const fetchData = async () => {
    let responseData = await getAllProduct();
    if (responseData && responseData.Products) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: responseData.Products,
      });
    }
  };

  const handleImageChange = (files) => {
    const fileList = Array.from(files);
    const validImages = fileList.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length > 0) {
      setFdata({ ...fData, pEditImages: [...(fData.pEditImages || []), ...validImages] });
      const newPreviews = validImages.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeNewImage = (index) => {
    const newImages = [...fData.pEditImages];
    newImages.splice(index, 1);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    
    setFdata({ ...fData, pEditImages: newImages.length > 0 ? newImages : null });
    setPreviews(newPreviews);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e.dataTransfer.files);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    dispatch({ type: "loading", payload: true });

    try {
      let finalSize = fData.pSize === "Other" ? `${customSize} ml` : fData.pSize;
      let responseData = await editProduct({ ...fData, pSize: finalSize });
      
      if (responseData.success) {
        fetchData();
        setFdata({ ...fData, success: responseData.success, error: false });
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
           dispatch({ type: "editProductModalClose", payload: false });
        }, 1000);
      } else if (responseData.error) {
        setFdata({ ...fData, success: false, error: responseData.error });
        dispatch({ type: "loading", payload: false });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  return (
    <Fragment>
      <div
        onClick={(e) => dispatch({ type: "editProductModalClose", payload: false })}
        className={`${
          data.editProductModal.modal ? "" : "hidden"
        } fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500`}
      />

      <div
        className={`${
          data.editProductModal.modal ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        } fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 overflow-y-auto`}
      >
        <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 max-h-[90vh] my-auto">
          
          <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -ml-40 -mt-40 opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
            <div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tighter uppercase italic text-emerald-600">Edit <span className="text-gray-900">Product</span></h2>
                 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">Update product details</p>
            </div>
            <button
                onClick={(e) => dispatch({ type: "editProductModalClose", payload: false })}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-600 hover:text-gray-900 hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="relative z-10 p-10 overflow-y-auto">
            {fData.error && (
                <div className="mb-6 px-6 py-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest italic animate-pulse">
                    Error: {fData.error}
                </div>
            )}
            {fData.success && (
                <div className="mb-6 px-6 py-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest italic">
                    Product Updated Successfully
                </div>
            )}

            <form className="space-y-8" onSubmit={submitForm}>
                
                {/* Image Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-12 flex flex-col space-y-4">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Product Images</label>
                        <div className="flex flex-wrap gap-4">
                            {/* Existing Images */}
                            {fData.pImages && fData.pImages.map((img, i) => (
                                <div key={i} className="relative aspect-square w-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 group/old">
                                    <img src={`${apiURL}/uploads/products/${img}`} className="w-full h-full object-contain p-1 grayscale group-hover/old:grayscale-0 transition-all" alt="Existing" />
                                    <div className="absolute inset-0 bg-gray-900/10 opacity-40"></div>
                                </div>
                            ))}
                            {/* New Previews */}
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-square w-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg bg-white group/new">
                                    <img src={src} className="w-full h-full object-contain p-1" alt="New" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-lg flex items-center justify-center shadow-lg"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                            {/* Dropzone */}
                            <div 
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={`relative aspect-square w-24 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center ${isDragging ? 'border-emerald-500 bg-emerald-50 scale-105' : 'border-gray-100 bg-gray-50 hover:border-emerald-300 hover:bg-white'}`}
                            >
                                <svg className={`w-6 h-6 ${isDragging ? 'text-emerald-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                <input
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e.target.files)}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    type="file"
                                    multiple
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Product Name</label>
                        <input
                            onChange={(e) => setFdata({ ...fData, success: false, error: false, pName: e.target.value })}
                            value={fData.pName}
                            placeholder="Enter product name"
                            className="px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 uppercase tracking-tight"
                            type="text"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Price ($)</label>
                        <input
                            onChange={(e) => setFdata({ ...fData, success: false, error: false, pPrice: e.target.value })}
                            value={fData.pPrice}
                            placeholder="0.00"
                            className="px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 uppercase tracking-tight"
                            type="number"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Discount (%)</label>
                        <input
                            onChange={(e) => setFdata({ ...fData, success: false, error: false, pOffer: e.target.value })}
                            value={fData.pOffer}
                            placeholder="0"
                            className="px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 uppercase tracking-tight text-rose-500"
                            type="number"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Category</label>
                        <div className="relative group/select">
                            <select
                                onChange={(e) => setFdata({ ...fData, success: false, error: false, pCategory: e.target.value })}
                                value={fData.pCategory}
                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 appearance-none italic uppercase tracking-widest pr-12 cursor-pointer"
                                required
                            >
                                <option disabled value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.cName.toUpperCase()}</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover/select:text-emerald-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Size</label>
                        <div className="relative group/select">
                            <select
                                onChange={(e) => setFdata({ ...fData, pSize: e.target.value })}
                                value={fData.pSize}
                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 appearance-none italic uppercase tracking-widest pr-12 cursor-pointer"
                                required
                            >
                                <option value="" disabled>Select Size</option>
                                <option value="5 ml">5 ML</option>
                                <option value="10 ml">10 ML</option>
                                <option value="20 ml">20 ML</option>
                                <option value="50 ml">50 ML</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover/select:text-emerald-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        {fData.pSize === "Other" && (
                            <input
                                value={customSize}
                                onChange={(e) => setCustomSize(e.target.value)}
                                placeholder="Enter custom size (ml)"
                                type="number"
                                className="mt-3 px-8 py-5 bg-gray-50 border-2 border-emerald-400 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-600 transition-all font-bold text-gray-600 uppercase tracking-tight"
                                required
                            />
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Type</label>
                        <div className="relative group/select">
                            <select
                                onChange={(e) => setFdata({ ...fData, pProperty: e.target.value })}
                                value={fData.pProperty}
                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 appearance-none italic uppercase tracking-widest pr-12 cursor-pointer"
                                required
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="Perfume">Perfume</option>
                                <option value="Edt">EDT</option>
                                <option value="Edp">EDP</option>
                                <option value="Edu">EDU</option>
                                <option value="Attar">Attar</option>
                                <option value="Rollon">Rollon</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover/select:text-emerald-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Status</label>
                        <div className="relative group/select">
                            <select
                                onChange={(e) => setFdata({ ...fData, pStatus: e.target.value })}
                                value={fData.pStatus}
                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-600 appearance-none italic uppercase tracking-widest pr-12 cursor-pointer"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Disabled">Disabled</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover/select:text-emerald-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Description</label>
                        <textarea
                            onChange={(e) => setFdata({ ...fData, pDescription: e.target.value })}
                            value={fData.pDescription}
                            placeholder="Product Description..."
                            className="px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-medium text-gray-500 min-h-[120px] italic"
                            required
                        />
                    </div>
                    <div className="lg:col-span-4 flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-2 italic">Stock Quantity</label>
                        <input
                            onChange={(e) => setFdata({ ...fData, pQuantity: e.target.value })}
                            value={fData.pQuantity}
                            placeholder="0"
                            className="px-8 py-10 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-4xl text-gray-600 text-center tracking-tighter"
                            type="number"
                            required
                        />
                    </div>
                </div>

                <div className="pt-6 pb-8 bg-white sticky bottom-0 border-t border-gray-100 -mx-10 px-10">
                    <button
                        type="submit"
                        disabled={data.loading}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2"
                    >
                        {data.loading ? (
                             <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Fragment>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                <span>Update Product</span>
                            </Fragment>
                        )}
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditProductModal;
