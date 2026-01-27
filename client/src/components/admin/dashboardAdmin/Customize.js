import React, { Fragment, useContext, useEffect } from "react";
import { DashboardContext } from "./";
import { uploadImage, sliderImages, deleteImage } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

const Customize = () => {
  const { data, dispatch } = useContext(DashboardContext);

  return (
    <Fragment>
      <div className="bg-white border-t border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">Visual Experience</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Hero Section</h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Manage your homepage hero section. Upload high-resolution images to capture user attention. 
                    Recommended resolution is <span className="text-gray-900 font-bold italic underline decoration-indigo-200">2000x800px</span> for optimal display.
                </p>
            </div>
            
            <button
                onClick={(e) =>
                    dispatch({
                        type: "uploadSliderBtn",
                        payload: !data.uploadSliderBtn,
                    })
                }
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    data.uploadSliderBtn 
                    ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100" 
                    : "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200"
                }`}
            >
                {data.uploadSliderBtn ? (
                    <Fragment>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        <span>Cancel Upload</span>
                    </Fragment>
                ) : (
                    <Fragment>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        <span>Configure New Slide</span>
                    </Fragment>
                )}
            </button>
        </div>

        {data.uploadSliderBtn && <UploadForm />}
        <SliderGallery />
      </div>
    </Fragment>
  );
};

const UploadForm = () => {
  const { data, dispatch } = useContext(DashboardContext);

  const uploadImageHandler = (image) => {
    if (!image) return;
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio >= 2.4 && ratio <= 2.6) {
        uploadImage(image, dispatch);
      } else {
        alert("Image aspect ratio must be close to 2.5:1 (e.g. 2000x800).");
      }
      URL.revokeObjectURL(img.src);
    };
  };

  return (
    <div className="mb-12 p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-4 hover:border-indigo-300 transition-colors group relative overflow-hidden">
        <input
            onChange={(e) => uploadImageHandler(e.target.files[0])}
            name="image"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            type="file"
            id="image"
        />
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        </div>
        <div className="text-center">
            <p className="text-sm font-bold text-gray-900 mb-1">Drop your image here or click to browse</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">PNG, JPG or WebP up to 5MB</p>
        </div>
    </div>
  );
};

const SliderGallery = () => {
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.imageUpload && (
          <div className="col-span-1 border-2 border-dashed border-indigo-100 rounded-2xl aspect-[2.5/1] flex flex-col items-center justify-center bg-indigo-50/30">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Processing...</span>
          </div>
      )}
      {data.sliderImages.map((item, index) => (
        <div key={index} className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col bg-white">
          <div className="relative aspect-[2.5/1] overflow-hidden bg-gray-100">
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={`${apiURL}/uploads/customize/${item.slideImage}`}
              alt=""
            />
            <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black shadow-sm text-gray-900 border border-gray-100">
                    SLIDE #{index + 1}
                </span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between border-t border-gray-50">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Configuration</span>
                <span className="text-sm font-bold text-gray-900">Active Campaign</span>
             </div>
             <button
                onClick={() => deleteImage(item._id, dispatch)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove Slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
          </div>
        </div>
      ))}
      {!data.imageUpload && data.sliderImages.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200 mb-4 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">No Visual Media Found</p>
          </div>
      )}
    </div>
  );
};

export default Customize;
