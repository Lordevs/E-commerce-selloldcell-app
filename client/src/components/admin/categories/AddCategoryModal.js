import React, { Fragment, useContext, useState } from "react";
import { CategoryContext } from "./index";
import { createCategory, getAllCategory } from "./FetchApi";

const AddCategoryModal = () => {
  const { data, dispatch } = useContext(CategoryContext);

  const [fData, setFdata] = useState({
    cName: "",
    cDescription: "",
    cImage: "",
    cStatus: "Active",
    success: false,
    error: false,
  });

  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: responseData.Categories,
      });
    }
  };

  const submitForm = async (e) => {
    dispatch({ type: "loading", payload: true });
    e.preventDefault();

    if (!fData.cImage) {
      dispatch({ type: "loading", payload: false });
      return setFdata({ ...fData, error: "Please upload a category identification image" });
    }

    try {
      let responseData = await createCategory(fData);
      if (responseData.success) {
        fetchData();
        setFdata({
          ...fData,
          cName: "",
          cDescription: "",
          cImage: "",
          cStatus: "Active",
          success: responseData.success,
          error: false,
        });
        setPreview(null);
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
           dispatch({ type: "addCategoryModal", payload: false });
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

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFdata({ ...fData, success: false, error: false, cImage: file });
      setPreview(URL.createObjectURL(file));
    } else if (file) {
      setFdata({ ...fData, error: "Please upload a valid image file" });
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFdata({ ...fData, cImage: "" });
    setPreview(null);
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
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  return (
    <Fragment>
      <div
        onClick={() => dispatch({ type: "addCategoryModal", payload: false })}
        className={`${
          data.addCategoryModal ? "" : "hidden"
        } fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500`}
      />

      <div
        className={`${
          data.addCategoryModal ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
        } fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500`}
      >
        <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 max-h-[95vh]">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-gray-50/30">
            <div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tighter uppercase italic">Add <span className="text-indigo-600">Category</span></h2>
                 {/* <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Define new classification parameters</p> */}
            </div>
            <button
                onClick={(e) => dispatch({ type: "addCategoryModal", payload: false })}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:shadow-lg transition-all"
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
                    Category Added Successfully
                </div>
            )}

            <form className="space-y-8" onSubmit={(e) => submitForm(e)}>
                <div className="flex flex-col space-y-4 items-center">
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative group w-full h-48 rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden shadow-inner ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-gray-100 bg-gray-50/50 hover:border-indigo-300'}`}
                    >
                        {preview ? (
                            <Fragment>
                                <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                                <div className="absolute top-4 right-4 z-20">
                                    <button 
                                        onClick={removeImage}
                                        className="w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-90 active:scale-90"
                                        title="Remove Image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">Drop new image to replace</p>
                                </div>
                            </Fragment>
                        ) : (
                            <div className="flex flex-col items-center space-y-3 pointer-events-none">
                                <div className={`p-4 rounded-2xl bg-white shadow-sm border border-gray-100 transition-transform duration-500 ${isDragging ? 'scale-110 rotate-12' : ''}`}>
                                    <svg className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Drop Image Here</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Click to Upload</p>
                                </div>
                            </div>
                        )}
                        <input
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            type="file"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic" htmlFor="name">Name</label>
                        <input
                            onChange={(e) => setFdata({ ...fData, success: false, error: false, cName: e.target.value })}
                            value={fData.cName}
                            placeholder="Category Name"
                            className="px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all font-bold text-gray-600 uppercase tracking-tight"
                            type="text"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic" htmlFor="status">Status</label>
                        <div className="relative group/select">
                            <select
                                onChange={(e) => setFdata({ ...fData, success: false, error: false, cStatus: e.target.value })}
                                value={fData.cStatus}
                                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all font-bold text-gray-600 appearance-none italic uppercase tracking-widest pr-12 cursor-pointer"
                                id="status"
                            >
                                <option value="Active">Active</option>
                                <option value="Disabled">Disabled</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-indigo-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 italic" htmlFor="description">Description</label>
                    <textarea
                        onChange={(e) => setFdata({ ...fData, success: false, error: false, cDescription: e.target.value })}
                        value={fData.cDescription}
                        placeholder="Category Description..."
                        className="px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all font-medium text-gray-500 min-h-[150px] italic"
                        name="description"
                        id="description"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={data.loading}
                        className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-gray-200 hover:-translate-y-2 active:scale-95 flex items-center justify-center space-x-4"
                    >
                        {data.loading ? (
                             <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Fragment>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                <span>Add Category</span>
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

export default AddCategoryModal;
