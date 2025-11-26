import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Camera, Leaf } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate image type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // We might want a way to reset the parent state, but for now this just clears the UI
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${isDragging ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-green-400 hover:bg-slate-50'}
          ${previewUrl ? 'h-96' : 'h-64'}
          flex flex-col items-center justify-center
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {!isLoading && (
               <button
                onClick={clearImage}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-50 text-slate-600 hover:text-red-500 transition-all z-10"
              >
                <X size={20} />
              </button>
            )}
           
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center flex-col text-white">
                 <div className="relative">
                   <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Leaf size={24} className="text-green-500 animate-pulse" />
                   </div>
                 </div>
                 <p className="mt-4 font-medium text-lg animate-pulse">Analyzing Plant Health...</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 transition-transform duration-300 group-hover:-translate-y-1">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Camera size={40} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Upload Plant Photo</h3>
            <p className="text-slate-500 mt-2 text-sm">
              Click to browse or drag and drop<br/>
              <span className="text-xs text-slate-400 mt-1 block">Supports JPG, PNG</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;