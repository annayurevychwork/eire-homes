import React from 'react';
import type { FilterState } from '../types';

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const Filters: React.FC<Props> = ({ filters, setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? '' : name === 'berRating' ? value : Number(value)
    }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Min Price (€)</label>
        <input 
          type="number" 
          name="minPrice" 
          value={filters.minPrice} 
          onChange={handleChange}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
      
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Max Price (€)</label>
        <input 
          type="number" 
          name="maxPrice" 
          value={filters.maxPrice} 
          onChange={handleChange}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any"
        />
      </div>

      <div className="flex-1 min-w-[120px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
        <select 
          name="bedrooms" 
          value={filters.bedrooms} 
          onChange={handleChange}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="flex-1 min-w-[120px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Min BER Rating</label>
        <select 
          name="berRating" 
          value={filters.berRating} 
          onChange={handleChange}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Any</option>
          <option value="A">A-Rated (A1-A3)</option>
          <option value="B">B-Rated or better</option>
          <option value="C">C-Rated or better</option>
        </select>
      </div>
    </div>
  );
};