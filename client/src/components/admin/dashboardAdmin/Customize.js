import React, { Fragment, useContext, useEffect } from "react";
import { DashboardContext } from "./";
import { uploadImage, sliderImages, deleteImage } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

const Customize = () => {
  const { data, dispatch } = useContext(DashboardContext);

  return (
    <Fragment>
      <div className="">
        {!data.uploadSliderBtn ? (
          <button
            onClick={(e) =>
              dispatch({
                type: "uploadSliderBtn",
                payload: !data.uploadSliderBtn,
              })
            }
            className="group relative flex items-center justify-center px-8 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl active:scale-95"
          >
            <svg
              className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Customize Slider Images
          </button>
        ) : (
          ""
        )}
      </div>
      {data.uploadSliderBtn ? <UploadImageSection /> : ""}
    </Fragment>
  );
};

const UploadImageSection = () => {
  const { data, dispatch } = useContext(DashboardContext);

  const uploadImageHandler = (image) => {
    if (!image) return;
    
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const ratio = width / height;
      
      if (ratio >= 2.45 && ratio <= 2.55) {
        uploadImage(image, dispatch);
      } else {
        alert("Image must be approximately 2000x800 resolution (Aspect Ratio 2.5:1)");
      }
      URL.revokeObjectURL(img.src);
    };
  };

  return (
    <Fragment>
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 transition-all duration-500">
        <div className="flex items-center justify-between border-b border-gray-100 mb-8 pb-6">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-indigo-50 rounded-2xl">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
             <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Shop Slider Images</h1>
                <p className="text-sm text-gray-400 font-medium mt-1">Recommended: 2000x800 pixels</p>
             </div>
          </div>
          
          <button
            onClick={(e) =>
              dispatch({
                type: "uploadSliderBtn",
                payload: !data.uploadSliderBtn,
              })
            }
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative group w-full md:w-auto">
            <div className="relative z-10 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-lg group-hover:bg-indigo-700 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Choose New Slide</span>
            </div>
            <input
              onChange={(e) => uploadImageHandler(e.target.files[0])}
              name="image"
              accept="image/*"
              className="absolute inset-0 z-20 opacity-0 cursor-pointer"
              type="file"
              id="image"
            />
          </div>
          
          <div className="flex-1">
             <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                <p className="text-xs text-yellow-800 font-semibold uppercase tracking-widest mb-1">Upload Guide</p>
                <p className="text-sm text-yellow-700">Ensure high-resolution images for best appearance on large screens.</p>
             </div>
          </div>
        </div>

        <AllImages />
      </div>
    </Fragment>
  );
};

const AllImages = () => {
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    sliderImages(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteImageReq = (id) => {
    deleteImage(id, dispatch);
  };

  return (
    <Fragment>
      {data.imageUpload ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Uploading Image...</p>
        </div>
      ) : (
        ""
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {data.sliderImages.length > 0 ? (
          data.sliderImages.map((item, index) => {
            return (
              <div key={index} className="group relative col-span-1 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <img
                  className="w-full aspect-[2.5/1] object-cover group-hover:scale-110 transition-transform duration-700"
                  src={`${apiURL}/uploads/customize/${item.slideImage}`}
                  alt="sliderImages"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                   <span className="text-white text-sm font-bold tracking-tight">Slide {index + 1}</span>
                   <button
                     onClick={(e) => deleteImageReq(item._id)}
                     className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center">
             <div className="inline-flex p-6 bg-gray-50 rounded-full text-gray-300 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
             <p className="text-xl font-medium text-gray-400">No slide images found in gallery</p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Customize;
