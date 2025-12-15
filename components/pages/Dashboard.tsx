import React, { useEffect, useState } from 'react';
import { Clock, Plus, ArrowRight, Car, AlertCircle, Loader2, ChevronRight, BarChart3, Search } from 'lucide-react';
import { loadDraft } from '../../services/draftService';
import { api } from '../../services/api';
import { VehicleFormData } from '../../types';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  onNavigateToAdd: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToAdd }) => {
  const [draft, setDraft] = useState<VehicleFormData | null>(null);
  const [totalStock, setTotalStock] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load local draft (async now)
    const fetchDraft = async () => {
      const savedDraft = await loadDraft();
      if (savedDraft && (savedDraft.data.make || savedDraft.data.model || savedDraft.data.price)) {
        setDraft(savedDraft.data);
      }
    };
    fetchDraft();

    // Load real stats
    const fetchStats = async () => {
      try {
        const vehicles = await api.getVehicles();
        // Count vehicles that are For Sale or Paused (Live Inventory)
        const liveCount = vehicles.filter(v => v.status === 'For Sale').length;
        setTotalStock(liveCount);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        setTotalStock(0);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-lg mx-auto">
      {/* Welcome Section */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
           <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
           <p className="text-xs text-slate-500 font-medium mt-0.5">Inventory Overview</p>
        </div>
      </div>

      {/* Stats Cards - Compact Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Active Stock */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl text-white shadow-md shadow-blue-900/10 overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2 opacity-90">
              <div className="p-1 bg-white/20 rounded-md backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Car className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Stock</span>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-0.5">
              {isLoadingStats ? <Loader2 className="w-6 h-6 animate-spin opacity-50" /> : totalStock}
            </div>
            <div className="text-[10px] font-medium text-blue-100">Vehicles Live</div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
        </div>

        {/* Pending Stats */}
        <div className="relative bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between group hover:border-slate-300 transition-colors">
           <div>
            <div className="flex items-center gap-1.5 mb-2 text-slate-500">
              <div className="p-1 bg-orange-50 rounded-md group-hover:bg-orange-100 transition-colors">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
            </div>
            <div className="text-2xl font-bold text-slate-800 tracking-tight mb-0.5">
              {draft ? 1 : 0}
            </div>
            <div className="text-[10px] font-medium text-slate-400">Local Drafts</div>
           </div>
        </div>
      </div>

      {/* Quick Actions - Compact Grid */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={onNavigateToAdd} 
               className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5 transition-all group active:scale-[0.98] text-center"
             >
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2.5 group-hover:bg-blue-100 transition-colors text-blue-600">
                    <Plus className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-800 text-sm">Add Vehicle</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Create listing</div>
             </button>

             <button 
                onClick={() => navigate('/stock')}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/5 transition-all group active:scale-[0.98] text-center"
             >
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-2.5 group-hover:bg-purple-100 transition-colors text-purple-600">
                    <Search className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-800 text-sm">Browse Stock</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Manage inventory</div>
             </button>
        </div>
      </div>

      {/* Pending Drafts Section - Compact Horizontal Card */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">Pending Uploads</h3>
        
        {draft ? (
          <div 
            onClick={onNavigateToAdd}
            className="bg-white p-3 pr-4 rounded-2xl border border-orange-200/50 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer flex items-center gap-3.5 hover:border-orange-300/50 hover:shadow-md hover:shadow-orange-500/5"
          >
             {/* Icon Box */}
            <div className="w-11 h-11 shrink-0 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 border border-orange-100 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                    {draft.make || 'Untitled Vehicle'} {draft.model || ''}
                    </h3>
                    <div className="px-1.5 py-0.5 bg-orange-100 rounded text-[9px] font-bold text-orange-700 uppercase tracking-wide">Draft</div>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {draft.variant ? `${draft.variant} • ` : ''} 
                  {draft.year ? `${draft.year}` : 'Year N/A'}
                </p>
            </div>
            
            <div className="shrink-0 bg-slate-50 p-1.5 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
               <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
            <div className="mx-auto w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mb-2">
               <Clock className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-xs font-semibold text-slate-500">No pending drafts</p>
          </div>
        )}
      </div>
    </div>
  );
};