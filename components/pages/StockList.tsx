
import React, { useState, useEffect } from 'react';
import { Search, Fuel, Gauge, Loader2, AlertCircle, MapPin, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, getMediaUrl } from '../../services/api';
import { ApiVehicle } from '../../types';

export const StockList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await api.getVehicles();
        setVehicles(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load inventory. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, []);

  const filteredStock = vehicles.filter(car => 
    `${car.make} ${car.model} ${car.regNumber || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-24 space-y-6">
      {/* Search Header */}
      <div className="sticky top-[4rem] -mx-4 px-4 bg-slate-50/80 backdrop-blur-xl z-20 py-4 border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by make, model, or reg no..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
          <p className="text-sm font-medium">Loading inventory...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="bg-red-50 p-4 rounded-full mb-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm font-medium text-slate-800 mb-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-primary font-semibold py-2 px-4 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Tap to Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredStock.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center px-6">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
             <Search className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-base font-semibold text-slate-600 mb-1">No vehicles found</p>
          <p className="text-sm">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 max-w-7xl mx-auto">
        {filteredStock.map((car, index) => (
          <div 
            key={car.id} 
            onClick={() => navigate(`/stock/${car.id}`)}
            className="group bg-white rounded-3xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-slate-200 transition-all duration-300 cursor-pointer active:scale-[0.99]"
          >
            {/* Image Header */}
            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
               <img 
                 src={getMediaUrl(car.mainImage || car.imageUrl || car.img_front)} 
                 alt={`${car.make} ${car.model}`}
                 // Optimization: Eager load first 4 items for LCP, lazy load the rest
                 loading={index < 4 ? "eager" : "lazy"}
                 decoding="async"
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = getMediaUrl(); 
                 }}
               />
               
               {/* Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

               {/* Status Pill */}
               <div className="absolute top-3 left-3">
                 <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/10 ${
                   car.status === 'For Sale' ? 'bg-emerald-500/90 text-white' : 
                   car.status === 'Sold' ? 'bg-slate-800/90 text-white' : 'bg-orange-500/90 text-white'
                 }`}>
                   {car.status}
                 </span>
               </div>

               {/* Location Tag */}
               {car.rtoState && (
                 <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <MapPin className="w-3 h-3 text-white/90" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{car.rtoState}</span>
                 </div>
               )}
            </div>

            {/* Content Body */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                 <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">{car.year}</span>
                       {car.verified && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap">Verified</span>}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors truncate">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 truncate">{car.variant}</p>
                 </div>
                 <div className="text-right shrink-0 ml-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</p>
                    <p className="text-lg font-bold text-slate-900">₹{Number(car.price).toLocaleString('en-IN')}</p>
                 </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-slate-50 mb-4" />

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fuel</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                       <Fuel className="w-3.5 h-3.5 text-slate-400" />
                       <span className="truncate">{car.fuelType || 'N/A'}</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-1 pl-4 border-l border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driven</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                       <Gauge className="w-3.5 h-3.5 text-slate-400" />
                       <span className="truncate">{car.odometer ? `${(Number(car.odometer)/1000).toFixed(1)}k km` : 'N/A'}</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-1 pl-4 border-l border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                       <User className="w-3.5 h-3.5 text-slate-400" />
                       <span className="truncate">{car.ownership?.replace(' Owner', '') || 'N/A'}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
