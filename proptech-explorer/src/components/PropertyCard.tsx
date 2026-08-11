import React, { useState } from 'react';
import type { Property } from '../types';
import { Bed, Bath, Maximize, ChevronLeft, ChevronRight, MapPin, UploadCloud } from 'lucide-react';
import { uploadPropertyImage } from '../api/auth';

interface Props {
  property: Property;
  onImageUploaded?: (propertyId: string, newImageUrl: string) => void; 
}

export const PropertyCard: React.FC<Props> = ({ property, onImageUploaded }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [uploading, setUploading] = useState(false);

  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const canUpload = user?.role === 'ADMIN' || user?.role === 'AGENT';

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadPropertyImage(file, property.id);
      console.log('Фото оновлено для проперті:', property.id, response);

      if (onImageUploaded) {
        onImageUploaded(property.id, response.url);
      }
    } catch (err: any) {
      console.error('Помилка завантаження фото:', err);
      alert(err.response?.data?.message || 'Помилка завантаження. Перевірте авторизацію.');
    } finally {
      setUploading(false);
    }
  };

  const berClass = `ber-${property.ber.charAt(0)}`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <div className="relative h-56 group bg-slate-100">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[currentImg] || property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            No image available
          </div>
        )}

        {property.images && property.images.length > 1 && (
          <>
            <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${berClass}`}>
          BER {property.ber}
        </div>

        {canUpload && (
          <div className="absolute top-3 right-3 z-10">
            <label className={`flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <UploadCloud size={14} />
              <span>{uploading ? 'Saving...' : 'Add Photo'}</span>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">
            €{property.price.toLocaleString('en-IE')}
          </h3>
          <p className="text-slate-600 font-medium truncate mb-2">{property.title}</p>
          
          <div className="flex items-center text-slate-500 text-sm mb-4">
            <MapPin size={16} className="mr-1 shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-slate-600">
          <div className="flex items-center gap-1">
            <Bed size={18} /> <span className="font-medium">{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={18} /> <span className="font-medium">{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={18} /> <span className="font-medium">{property.sqm} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};