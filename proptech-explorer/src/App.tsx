import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProperties } from './api/properties';
import { saveSearch, fetchSavedSearches } from './api/auth';
import { Filters } from './components/Filters';
import { PropertyCard } from './components/PropertyCard';
import { Map } from './components/Map';
import { AuthModal } from './components/AuthModal';
import { UploadPropertyModal } from './components/UploadPropertyModal';
import type { FilterState } from './types';
import { Building2, Loader2, BookmarkPlus, LogIn, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    berRating: ''
  });

  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', filters, page],
    queryFn: () => fetchProperties({
      minPrice: filters.minPrice !== '' ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice !== '' ? Number(filters.maxPrice) : undefined,
      bedrooms: filters.bedrooms !== '' ? Number(filters.bedrooms) : undefined,
      ber: filters.berRating !== '' ? filters.berRating : undefined,
      page,
      limit
    }),
    placeholderData: (previousData) => previousData,
  });

  const { data: savedSearches } = useQuery({
    queryKey: ['savedSearches'],
    queryFn: fetchSavedSearches,
    enabled: !!user,
  });

  const saveSearchMutation = useMutation({
    mutationFn: () => saveSearch(filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedSearches'] });
      setSaveSuccessMsg('Search successfully saved to MongoDB!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    },
    onError: () => {
      setSaveSuccessMsg('Failed to save search.');
    }
  });

  const properties = data?.data || [];
  const total = data?.meta?.total || 0;
  const lastPage = data?.meta?.lastPage || 1;

  const handleNextPage = () => {
    if (page < lastPage) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Building2 size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Éire Homes</h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <User size={16} className="text-blue-600" /> {user.name} 
                  {user.role === 'ADMIN' && <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold ml-1">Admin</span>}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
              >
                <LogIn size={16} /> Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Filters 
          filters={filters} 
          setFilters={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }} 
        />

      {user && user.role !== 'ADMIN' && (
        <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => saveSearchMutation.mutate()}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              <BookmarkPlus size={16} /> Save This Search
            </button>
            {saveSuccessMsg && (
              <span className="text-sm text-green-700 font-medium">{saveSuccessMsg}</span>
            )}
          </div>

          {savedSearches && savedSearches.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto max-w-xl">
              <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Saved Searches:</span>
              {savedSearches.map((search: any, index: number) => (
                <button
                  key={search._id || index}
                  onClick={() => {
                    setFilters(search.filters);
                    setPage(1);
                  }}
                  className="text-xs bg-white border border-slate-200 hover:border-blue-400 text-slate-700 px-2.5 py-1.5 rounded-md shadow-2xs shrink-0 transition-colors cursor-pointer"
                >
                  Search #{index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
        
        <div className="flex items-center justify-between mb-4 mt-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {isLoading ? 'Loading properties...' : `${total} Properties Found`}
          </h2>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-6">
            Connection error with backend on port 4000. Please ensure the Nest.js server is running!
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            <div className="w-full lg:w-3/5 flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property: any) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onImageUploaded={(propertyId, newImageUrl) => {
                      queryClient.setQueryData(['properties', filters, page], (oldData: any) => {
                        if (!oldData || !oldData.data) return oldData;

                        const updatedProperties = oldData.data.map((p: any) => 
                          p.id === propertyId 
                            ? { ...p, images: [...(p.images || []), newImageUrl] } // 👈 Тепер нова фотка локально теж стає ПЕРШОЮ!
                            : p
                        );

                        return { ...oldData, data: updatedProperties };
                      });
                    }}
                  />
                ))}
                {properties.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500">
                    No properties match your criteria in the database.
                  </div>
                )}
              </div>

              {total > 0 && (
                <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === 1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>

                  <span className="text-slate-700 text-sm font-medium">
                    Page <span className="font-bold text-blue-600">{page}</span> of{' '}
                    <span className="font-bold">{lastPage}</span>
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={page >= lastPage}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      page >= lastPage
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                    }`}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="w-full lg:w-2/5 h-[500px] lg:h-[calc(100vh-200px)] sticky top-24">
              <Map properties={properties} />
            </div>
          </div>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(userData) => setUser(userData)} 
      />

      <UploadPropertyModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={(url) => {
          console.log('Uploaded image URL:', url);
        }}
      />
    </div>
  );
}

export default App;