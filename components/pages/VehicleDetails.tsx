
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Fuel, Gauge, Settings, 
  MapPin, CheckCircle2, 
  AlertCircle, Loader2, Info, Edit, X, ChevronLeft, ChevronRight, ImageIcon, FileCheck, AlertTriangle,
  Car, Zap, Armchair, Box, Layers, Disc, Flame, Video, Play, Fan
} from 'lucide-react';
import { api, getMediaUrl } from '../../services/api';
import { ApiVehicle } from '../../types';
import { DETAILED_IMAGES } from '../ImageSection';

// --- Improved Inspection Row Component ---
const InspectionRow = ({ label, status, remark }: { label: string, status?: string, remark?: string }) => {
  const isIssue = status === 'Issue';
  const isOK = status === 'OK';

  return (
    <div className="py-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
          isOK ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          isIssue ? 'bg-red-50 text-red-600 border-red-100' :
          'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          {status || 'NA'}
        </span>
      </div>
      
      {/* Dedicated Remark Box below the title */}
      {remark && (
        <div className={`mt-2 p-2.5 rounded-lg border text-xs font-medium leading-relaxed flex gap-2 ${
          isIssue ? 'bg-red-50/80 border-red-100 text-red-800' : 'bg-slate-50 border-slate-100 text-slate-600'
        }`}>
           <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${isIssue ? 'bg-red-500' : 'bg-slate-400'}`} />
           <span>{remark}</span>
        </div>
      )}
    </div>
  );
};

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<ApiVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await api.getVehicleById(id);
        setVehicle(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load vehicle details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/stock');
    }
  };

  const allImages = useMemo(() => {
    if (!vehicle) return [];
    
    const imgs: { label: string; url: string; type: 'main' | 'standard' | 'issue' | 'video' }[] = [];

    // 1. Main Image (Prioritize mainImage if available)
    const coverPhoto = vehicle.mainImage || vehicle.imageUrl;
    if (coverPhoto) {
      imgs.push({ label: 'Main Display', url: getMediaUrl(coverPhoto), type: 'main' });
    }

    // 2. Standard Gallery Images
    DETAILED_IMAGES.forEach(config => {
      if (vehicle[config.key] && typeof vehicle[config.key] === 'string') {
        imgs.push({ label: config.label, url: getMediaUrl(vehicle[config.key]), type: 'standard' });
      }
    });

    // 3. Inspection / Issue Images & Videos
    Object.keys(vehicle).forEach(key => {
      // Check for videos
      if (key.startsWith('video_') && vehicle[key] && typeof vehicle[key] === 'string') {
        let label = key.replace('video_insp_', '').replace('video_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        imgs.push({ label: `Video: ${label}`, url: getMediaUrl(vehicle[key]), type: 'video' });
        return;
      }

      // Check for extra images (Engine, Issue, etc)
      if (key.startsWith('img_') && vehicle[key] && typeof vehicle[key] === 'string') {
        const isKnownStandard = DETAILED_IMAGES.some(c => c.key === key);
        // Ensure we don't duplicate the cover photo if it happens to be stored in one of these keys, 
        // though typically cover photo is separate.
        if (!isKnownStandard && key !== 'imageUrl' && key !== 'mainImage') {
          let label = key
            .replace('img_insp_', '')
            .replace('img_', '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          if(key.includes('insp')) label = `Insp: ${label}`;
          imgs.push({ label, url: getMediaUrl(vehicle[key]), type: 'issue' });
        }
      }
    });

    return imgs;
  }, [vehicle]);

  const displayStandardImages = allImages.map((img, idx) => ({...img, idx})).filter(img => img.type === 'main' || img.type === 'standard');
  const displayIssueImages = allImages.map((img, idx) => ({...img, idx})).filter(img => img.type === 'issue');
  const displayVideos = allImages.map((img, idx) => ({...img, idx})).filter(img => img.type === 'video');

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % allImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! - 1 + allImages.length) % allImages.length);
    }
  };

  const maskRegNumber = (regNo?: string) => {
    if (!regNo) return undefined;
    if (regNo.length <= 6) return 'XXXXXX';
    return regNo.substring(0, regNo.length - 6) + 'XXXXXX';
  };

  // --- Inspection Groups Config ---
  const inspectionGroups = useMemo(() => {
    if (!vehicle) return [];
    return [
      {
        title: "Exterior Body",
        icon: Car,
        items: [
          { label: 'Bumper', status: vehicle.insp_bumper_status, remark: vehicle.insp_bumper_remark },
          { label: 'Bonnet', status: vehicle.insp_bonnet_status, remark: vehicle.insp_bonnet_remark },
          { label: 'Roof', status: vehicle.insp_roof_status, remark: vehicle.insp_roof_remark },
          { label: 'Fender', status: vehicle.insp_fender_status, remark: vehicle.insp_fender_remark },
          { label: 'Doors', status: vehicle.insp_doors_status, remark: vehicle.insp_doors_remark },
          { label: 'Pillars', status: vehicle.insp_pillars_status, remark: vehicle.insp_pillars_remark },
          { label: 'Quarter Panel', status: vehicle.insp_quarter_panel_status, remark: vehicle.insp_quarter_panel_remark },
          { label: 'Dickey Door', status: vehicle.insp_dickey_door_status, remark: vehicle.insp_dickey_door_remark },
        ]
      },
      {
        title: "Engine & Transmission",
        icon: Flame,
        items: [
          { label: 'Engine Assembly', status: vehicle.insp_engine_assembly_status, remark: vehicle.insp_engine_assembly_remark },
          { label: 'Battery', status: vehicle.insp_battery_status, remark: vehicle.insp_battery_remark },
          { label: 'Engine Oil', status: vehicle.insp_engine_oil_status, remark: vehicle.insp_engine_oil_remark },
          { label: 'Engine Oil Level', status: vehicle.insp_engine_oil_level_status, remark: vehicle.insp_engine_oil_level_remark },
          { label: 'Coolant', status: vehicle.insp_coolant_status, remark: vehicle.insp_coolant_remark },
          { label: 'Mounting', status: vehicle.insp_engine_mounting_status, remark: vehicle.insp_engine_mounting_remark },
          { label: 'Engine Sound', status: vehicle.insp_engine_sound_status, remark: vehicle.insp_engine_sound_remark },
          { label: 'Engine Smoke', status: vehicle.insp_engine_smoke_status, remark: vehicle.insp_engine_smoke_remark },
          { label: 'Blowby', status: vehicle.insp_blowby_status, remark: vehicle.insp_blowby_remark },
          { label: 'Clutch', status: vehicle.insp_clutch_status, remark: vehicle.insp_clutch_remark },
          { label: 'Gear Shifting', status: vehicle.insp_gear_shifting_status, remark: vehicle.insp_gear_shifting_remark },
        ]
      },
      {
        title: "Steering & Suspension",
        icon: Disc,
        items: [
          { label: 'Suspension', status: vehicle.insp_suspension_status, remark: vehicle.insp_suspension_remark },
          { label: 'Steering', status: vehicle.insp_steering_status, remark: vehicle.insp_steering_remark },
          { label: 'Brakes', status: vehicle.insp_brake_status, remark: vehicle.insp_brake_remark },
        ]
      },
      {
        title: "Air Conditioning",
        icon: Fan,
        items: [
          { label: 'AC Cooling', status: vehicle.insp_ac_status, remark: vehicle.insp_ac_remark },
          { label: 'Heater', status: vehicle.insp_heater_status, remark: vehicle.insp_heater_remark },
          { label: 'Climate Control', status: vehicle.insp_climate_control_status, remark: vehicle.insp_climate_control_remark },
        ]
      },
      {
        title: "Structure & Chassis",
        icon: Layers,
        items: [
          { label: 'Apron', status: vehicle.insp_apron_status, remark: vehicle.insp_apron_remark },
          { label: 'Apron Leg', status: vehicle.insp_apron_leg_status, remark: vehicle.insp_apron_leg_remark },
          { label: 'Firewall', status: vehicle.insp_firewall_status, remark: vehicle.insp_firewall_remark },
          { label: 'Cowl Top', status: vehicle.insp_cowl_top_status, remark: vehicle.insp_cowl_top_remark },
          { label: 'Lower Cross Member', status: vehicle.insp_lower_cross_member_status, remark: vehicle.insp_lower_cross_member_remark },
          { label: 'Upper Cross Member', status: vehicle.insp_upper_cross_member_status, remark: vehicle.insp_upper_cross_member_remark },
        ]
      },
      {
        title: "Electrical & Interior",
        icon: Zap,
        items: [
           { label: 'Power Windows', status: vehicle.insp_power_window_status, remark: vehicle.insp_power_window_remark },
           { label: 'Airbags', status: vehicle.insp_airbag_status, remark: vehicle.insp_airbag_remark },
           { label: 'Electricals', status: vehicle.insp_electrical_status, remark: vehicle.insp_electrical_remark },
           { label: 'Interior', status: vehicle.insp_interior_status, remark: vehicle.insp_interior_remark },
           { label: 'Music System', status: vehicle.insp_music_system_status, remark: vehicle.insp_music_system_remark },
           { label: 'Seats', status: vehicle.insp_seat_status, remark: vehicle.insp_seat_remark },
           { label: 'Sunroof', status: vehicle.insp_sunroof_status, remark: vehicle.insp_sunroof_remark },
           { label: 'Camera / Sensor', status: vehicle.insp_camera_sensor_status, remark: vehicle.insp_camera_sensor_remark },
        ]
      },
      {
        title: "Glass & Lights",
        icon: Box,
        items: [
          { label: 'Front Show', status: vehicle.insp_front_show_status, remark: vehicle.insp_front_show_remark },
          { label: 'Windshield', status: vehicle.insp_windshield_status, remark: vehicle.insp_windshield_remark },
          { label: 'ORVM', status: vehicle.insp_orvm_status, remark: vehicle.insp_orvm_remark },
          { label: 'Lights', status: vehicle.insp_lights_status, remark: vehicle.insp_lights_remark },
          { label: 'Fog Lights', status: vehicle.insp_fog_lights_status, remark: vehicle.insp_fog_lights_remark },
        ]
      },
      {
        title: "Wheels & Tyres",
        icon: Disc,
        items: [
           { label: 'Alloy Wheels', status: vehicle.insp_alloy_wheels_status, remark: vehicle.insp_alloy_wheels_remark },
           { label: 'Tyres Condition', status: vehicle.insp_wheels_status, remark: vehicle.insp_wheels_remark },
        ]
      }
    ];
  }, [vehicle]);

  const issueCount = useMemo(() => {
    if(!vehicle) return 0;
    return Object.keys(vehicle).filter(k => k.endsWith('_status') && vehicle[k] === 'Issue').length;
  }, [vehicle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev! + 1) % allImages.length);
      if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev! - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, allImages.length]);

  if (isLoading) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin mb-2" /><p className="text-sm">Loading details...</p></div>;
  if (error || !vehicle) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-500"><AlertCircle className="w-8 h-8 mb-2" /><p className="text-sm">{error || 'Vehicle not found'}</p><button onClick={() => navigate('/stock')} className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Back to Inventory</button></div>;

  return (
    <div className="pb-32 animate-fade-in-up bg-slate-50 min-h-screen">
      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm" onClick={closeLightbox}>
          <div className="absolute top-4 right-4 flex gap-4 z-[110]">
             <button onClick={closeLightbox} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 backdrop-blur-md transition-colors"><X className="w-6 h-6" /></button>
          </div>
          
          <div className="w-full h-full flex items-center justify-center p-4 relative">
             {allImages[selectedImageIndex].type === 'video' ? (
                <video 
                   src={allImages[selectedImageIndex].url} 
                   controls 
                   autoPlay 
                   className="max-h-full max-w-full shadow-2xl" 
                   onClick={(e) => e.stopPropagation()} 
                />
             ) : (
                <img 
                   src={allImages[selectedImageIndex].url} 
                   alt={allImages[selectedImageIndex].label} 
                   className="max-h-full max-w-full object-contain shadow-2xl" 
                   onClick={(e) => e.stopPropagation()}
                   onError={(e) => {
                     (e.currentTarget as HTMLImageElement).src = getMediaUrl();
                   }}
                />
             )}
             
             {allImages.length > 1 && (
               <>
                 <button onClick={prevImage} className="absolute left-2 md:left-8 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/5"><ChevronLeft className="w-8 h-8" /></button>
                 <button onClick={nextImage} className="absolute right-2 md:right-8 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/5"><ChevronRight className="w-8 h-8" /></button>
               </>
             )}
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
             <div className="inline-block px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium">
                {allImages[selectedImageIndex].label} ({selectedImageIndex + 1}/{allImages.length})
             </div>
          </div>
        </div>
      )}

      {/* Transparent Header for Back Button */}
      <div className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-start pointer-events-none">
        <button onClick={handleBack} className="p-2.5 bg-white/90 backdrop-blur-md shadow-sm rounded-xl text-slate-800 pointer-events-auto hover:bg-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
      </div>

      {/* REPORT CONTENT START */}
      <div className="bg-slate-50 min-h-screen">
        {/* Hero Image */}
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-slate-900 group cursor-pointer" onClick={() => allImages.length > 0 && openLightbox(0)}>
           {allImages.length > 0 ? (
              <img 
                src={allImages[0].url} 
                alt="Main" 
                className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getMediaUrl();
                }}
              />
           ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500"><ImageIcon className="w-12 h-12" /></div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/20 pointer-events-none" />
           
           <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 text-white">
              <div className="flex items-center gap-2 mb-2">
                 <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                     vehicle.status === 'For Sale' ? 'bg-emerald-500 text-white' : 
                     vehicle.status === 'Sold' ? 'bg-slate-700 text-white' : 'bg-orange-500 text-white'
                 }`}>
                    {vehicle.status}
                 </span>
                 {vehicle.verified && <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>}
              </div>
              <h1 className="text-3xl font-bold leading-tight shadow-black drop-shadow-md">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
              <p className="text-white/80 font-medium text-sm mt-1">{vehicle.variant} • {vehicle.fuelType}</p>
           </div>
        </div>

        <div className="px-4 -mt-6 relative z-10 space-y-5">
          
          {/* Price & Primary Specs Card */}
          <div className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100">
             <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Asking Price</p>
                   <p className="text-3xl font-bold text-slate-900">₹ {Number(vehicle.price).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Odometer</p>
                   <p className="text-lg font-bold text-slate-700">{vehicle.odometer} km</p>
                </div>
             </div>
             
             <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Trans.', value: vehicle.transmission, icon: Settings },
                  { label: 'Owner', value: vehicle.ownership?.split(' ')[0], icon: CheckCircle2 },
                  { label: 'RTO', value: vehicle.rtoState, icon: MapPin },
                ].map((item, i) => (
                   <div key={i} className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                      <item.icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{item.value}</p>
                   </div>
                ))}
             </div>
          </div>

          {/* Issue Summary Alert */}
          {issueCount > 0 ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-sm">Inspection Issues Detected</h3>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  There are <strong>{issueCount} issues</strong> flagged in this vehicle. Review the report below for details.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
               <div className="p-2 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
                 <CheckCircle2 className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="font-bold text-emerald-900 text-sm">Great Condition</h3>
                 <p className="text-xs text-emerald-700 mt-0.5">No major issues flagged during inspection.</p>
               </div>
            </div>
          )}

          {/* Full Spec List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 flex items-center gap-2.5">
                 <Info className="w-4 h-4 text-slate-500" />
                 <h3 className="text-sm font-bold text-slate-800">Additional Specifications</h3>
              </div>
              <div className="divide-y divide-slate-50">
                 {[
                    { label: 'Registration Number', value: maskRegNumber(vehicle.regNumber), uppercase: true },
                    { label: 'Insurance', value: vehicle.insurance },
                    { label: 'Expiry', value: vehicle.insuranceExpiry },
                    { label: 'Color', value: vehicle.color },
                    { label: 'Body Type', value: vehicle.category === '4w' ? 'Car' : 'Bike' },
                    { label: 'Hypothecation', value: vehicle.hypothecation },
                 ].filter(i => i.value).map((item, i) => (
                    <div key={i} className="px-5 py-3 flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">{item.label}</span>
                        <span className={`font-semibold text-slate-900 ${item.uppercase ? 'uppercase' : ''}`}>{item.value}</span>
                    </div>
                 ))}
              </div>
          </div>

          {/* Gallery */}
          {displayStandardImages.length > 0 && (
             <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 px-1">Gallery</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                   {displayStandardImages.map((img) => (
                     <div key={img.idx} className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer" onClick={() => openLightbox(img.idx)}>
                        <img 
                          src={img.url} 
                          alt={img.label} 
                          className="w-full h-full object-cover" 
                          loading="lazy" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getMediaUrl();
                          }}
                        />
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* Full Inspection Report */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <FileCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-slate-900">Inspection Report</h2>
             </div>
             
             {inspectionGroups.map((group, idx) => (
               <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 flex items-center gap-2.5">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-500">
                      <group.icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{group.title}</h3>
                 </div>
                 <div className="p-4 space-y-2">
                   {group.items.map((item, i) => (
                     <InspectionRow key={i} {...item} />
                   ))}
                 </div>
               </div>
             ))}
          </div>

          {/* Video Evidence Section */}
          {displayVideos.length > 0 && (
            <div className="space-y-3">
               <div className="flex items-center gap-2 px-1">
                  <Video className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-slate-900">Video Evidence</h2>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {displayVideos.map((vid) => (
                      <div 
                        key={vid.idx} 
                        className="aspect-video rounded-xl overflow-hidden bg-black relative cursor-pointer group shadow-sm"
                        onClick={() => openLightbox(vid.idx)}
                      >
                        <video src={vid.url} className="w-full h-full object-cover opacity-80" muted />
                        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                           </div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                          {vid.label}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* Issue Gallery */}
          {displayIssueImages.length > 0 && (
            <div className="space-y-3">
               <div className="flex items-center gap-2 px-1">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-slate-900">Damage Photos</h2>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {displayIssueImages.map((img) => (
                      <div 
                        key={img.idx} 
                        className="aspect-square rounded-lg overflow-hidden bg-red-50 border border-red-100 relative cursor-pointer group"
                        onClick={() => openLightbox(img.idx)}
                      >
                        <img 
                          src={img.url} 
                          alt={img.label} 
                          className="w-full h-full object-cover" 
                          loading="lazy" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getMediaUrl();
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-red-900/80 text-white text-[9px] font-medium p-1 text-center truncate">{img.label}</div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
      {/* REPORT CONTENT END */}
      
      {/* Quick Action Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-6 z-30 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
         <button 
           onClick={() => navigate(`/edit/${id}`)}
           className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
         >
            <Edit className="w-4 h-4" /> Edit Vehicle
         </button>
      </div>
    </div>
  );
};
