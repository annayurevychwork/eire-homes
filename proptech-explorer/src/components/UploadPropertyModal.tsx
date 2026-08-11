import React, { useState } from 'react';
import { uploadPropertyImage } from '../api/auth';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
}

export const UploadPropertyModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const response = await uploadPropertyImage(file);

      const imageUrl = typeof response === 'string' ? response : (response.url || response.filePath);

      setPreviewUrl(imageUrl);
      onUploadSuccess(imageUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image. Make sure you are logged in!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Upload className="text-blue-600" size={24} /> Upload Property Photo
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Upload an image file (PNG, JPG, WEBP up to 5MB) to the server.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50">
            <ImageIcon className="text-slate-400 mb-2" size={40} />
            <span className="text-sm font-medium text-slate-700">Click to select an image</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP</span>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/webp" 
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {uploading && (
            <p className="text-center text-sm font-medium text-blue-600 animate-pulse">
              Uploading image to server...
            </p>
          )}

          {previewUrl && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Uploaded Image URL:</p>
              <input 
                type="text" 
                readOnly 
                value={previewUrl}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs text-slate-600 select-all mb-3"
              />
              <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border shadow-xs" />
            </div>
          )}

          <button 
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 rounded-lg transition-colors text-sm shadow-sm cursor-pointer mt-4"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};