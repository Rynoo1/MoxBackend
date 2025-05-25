import React, { useRef } from "react";

const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Upload Files</h2>
      <div className="w-full max-w-2xl">
        <div className="border border-gray-300 rounded-2xl p-8 flex flex-col items-center bg-white transition-shadow duration-200 shadow-sm hover:shadow-lg">
          <div className="mb-4 flex flex-col items-center">
            
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="4" fill="#E5E7EB"/>
              <path d="M12 16V8M12 8L8 12M12 8l4 4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg mb-1">Drag &amp; Drop your files here</p>
            <p className="text-gray-500 mb-4">Oops! Internet is disconnected.</p>
          </div>
          <button
            type="button"
            onClick={handleChooseFiles}
            className="hover:!text-[#1E3A8A] hover:bg-white bg-[#1E3A8A] border-2 border-[#1E3A8A] text-white font-semibold py-2 px-8 rounded-xl text-lg mb-2 transition">
            Choose files
          </button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-10">
        <button className="border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold py-3 rounded-xl text-lg hover:bg-[#1E3A8A] hover:text-white transition">
          Cancel
        </button>
        <button className="bg-[#1E3A8A] text-white font-semibold py-3 rounded-xl text-lg border-2 border-[#1E3A8A] hover:!text-[#1E3A8A] hover:bg-white transition">
          Attach File
        </button>
      </div>
    </div>
  );
};

export default FileUpload;