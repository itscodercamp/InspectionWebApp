
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, Info, Settings, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, FileText, UploadCloud,
  Banknote, Tag, Calendar, Hash, Activity, Cog, MapPin, User, ShieldCheck, Palette, Droplets, Gauge,
  Bike, ArrowLeft, ArrowRight, Save, Truck, Trash2, FileCheck, ChevronLeft, Wrench, AlertTriangle, Circle,
  Zap, Armchair, Flame, Disc, Fan, Ban, Camera, Check, Layers, Box, Video
} from 'lucide-react';
import { VehicleFormData, VehicleImages, INITIAL_FORM_DATA, INITIAL_IMAGES } from '../types';
import { saveDraft, loadDraft, clearDraft } from '../services/draftService';
import { api, getMediaUrl } from '../services/api';
import { InputField, SelectField, Toggle, SegmentedControl, PillSelector, TextAreaField, SectionHeader } from './ui/FormElements';
import { ImageSection, ImageInput, VideoInput } from './ImageSection';
import { useNavigate, useParams } from 'react-router-dom';

// --- Improved Inspection Item Component ---
interface InspectionItemProps {
  label: string;
  statusField: keyof VehicleFormData;
  remarkField: keyof VehicleFormData;
  imageKeys?: (keyof VehicleImages)[];
  videoKeys?: (keyof VehicleImages)[];
  allowNA?: boolean;
  formData: VehicleFormData;
  setFormData: React.Dispatch<React.SetStateAction<VehicleFormData>>;
  images: VehicleImages;
  setImages: React.Dispatch<React.SetStateAction<VehicleImages>>;
  existingImages: Record<string, string>;
  error?: string;
  isEnginePart?: boolean;
}

const InspectionItem: React.FC<InspectionItemProps> = ({ 
  label, statusField, remarkField, imageKeys = [], videoKeys = [], allowNA = false, 
  formData, setFormData, images, setImages, existingImages, error, isEnginePart
}) => {
  const status = formData[statusField] as string; // 'OK', 'Issue', 'NA'

  const handleStatusChange = (val: string) => {
    setFormData(prev => ({ ...prev, [statusField]: val }));
  };

  const handleRemarkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [remarkField]: e.target.value }));
  };

  const handleFileChange = (key: keyof VehicleImages, file: File | null) => {
    setImages(prev => ({ ...prev, [key]: file }));
  };

  // Logic: Show uploads if Issue, or if it's an Engine Part (to show clean condition), or if a video is required
  const showUploads = status === 'Issue' || isEnginePart || videoKeys.length > 0;
  
  // Logic: If user has already uploaded something, keep showing the upload area
  const hasExistingUploads = [...imageKeys, ...videoKeys].some(k => images[k] || existingImages[k as string]);

  const shouldRenderUploads = showUploads || hasExistingUploads;

  return (
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-300 mb-3
      ${status === 'Issue' ? 'bg-red-50/30 border-red-200' : 
        status === 'OK' ? 'bg-white border-slate-200' : 
        'bg-slate-50 border-slate-200 opacity-90'}
      ${error ? 'ring-1 ring-red-500 border-red-500' : ''}
    `}>
      <div className="p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Issue' ? 'bg-red-500' : status === 'OK' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <h4 className={`text-sm font-bold ${status === 'Issue' ? 'text-red-900' : 'text-slate-700'}`}>{label}</h4>
          </div>
          
          {/* Segmented Status Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg">
             <button
               type="button"
               onClick={() => handleStatusChange('OK')}
               className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 flex items-center gap-1 ${
                 status === 'OK' 
                   ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' 
                   : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               OK
             </button>

             <button
               type="button"
               onClick={() => handleStatusChange('Issue')}
               className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 flex items-center gap-1 ${
                 status === 'Issue' 
                   ? 'bg-white text-red-600 shadow-sm ring-1 ring-black/5' 
                   : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               Issue
             </button>

             {allowNA && (
               <button
                 type="button"
                 onClick={() => handleStatusChange('NA')}
                 className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 ${
                   status === 'NA' 
                     ? 'bg-white text-slate-600 shadow-sm ring-1 ring-black/5' 
                     : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 N/A
               </button>
             )}
          </div>
        </div>

        {/* Remark Field - Show if Issue OR if data exists */}
        {(status === 'Issue' || formData[remarkField]) && (
          <div className="animate-slide-up">
               <textarea
                 value={formData[remarkField] as string}
                 onChange={handleRemarkChange}
                 placeholder={`Describe issues with ${label} ...`}
                 className={`w-full p-2.5 text-xs font-medium rounded-lg focus:outline-none focus:ring-2 resize-none h-16 transition-all placeholder:text-slate-400 ${
                   status === 'Issue' 
                   ? 'bg-white border border-red-100 focus:border-red-300 focus:ring-red-100 text-red-900' 
                   : 'bg-slate-50 border border-slate-200 focus:border-blue-300 focus:ring-blue-100 text-slate-700'
                 }`}
               />
               {error && <p className="text-[10px] text-red-500 mt-1 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
          </div>
        )}

        {/* Media Uploads */}
        {shouldRenderUploads && (imageKeys.length > 0 || videoKeys.length > 0) && (
           <div className="pt-2 border-t border-dashed border-slate-100 animate-slide-up">
             <div className="flex items-center gap-2 mb-2">
                <Camera className="w-3 h-3 text-slate-400" />
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Evidence Photos/Videos</label>
             </div>
             <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
               {/* Images */}
               {imageKeys.map((key, idx) => (
                 <div key={key as string} className="w-14 shrink-0">
                   <ImageInput
                      config={{ key: key, label: `Img ${idx+1}` }}
                      file={images[key]}
                      existingUrl={existingImages[key as string]}
                      onChange={handleFileChange}
                   />
                 </div>
               ))}
               {/* Videos */}
               {videoKeys.map((key, idx) => (
                 <div key={key as string} className="w-14 shrink-0">
                   <VideoInput
                      config={{ key: key, label: `Video ${idx+1}` }}
                      file={images[key]}
                      existingUrl={existingImages[key as string]}
                      onChange={handleFileChange}
                   />
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export const VehicleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Step Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const [formData, setFormData] = useState<VehicleFormData>(INITIAL_FORM_DATA);
  const [images, setImages] = useState<VehicleImages>(INITIAL_IMAGES);
  const [existingImages, setExistingImages] = useState<Record<string, string>>({});
  
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormData, string> & { 
    mainImage?: string;
    img_rc?: string;
    img_noc?: string;
  }>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Computed: Total issues found
  const totalIssues = useMemo(() => {
    return Object.keys(formData).filter(key => key.endsWith('_status') && formData[key as keyof VehicleFormData] === 'Issue').length;
  }, [formData]);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (isEditMode && id) {
        try {
          const vehicle = await api.getVehicleById(id);
          
          // 1. Extract Images for Display (existingImages state)
          const loadedImages: Record<string, string> = {};
          
          // Handle Main Cover Image (Prioritize mainImage property, fallback to imageUrl)
          const coverPhoto = vehicle.mainImage || vehicle.imageUrl;
          if (coverPhoto) {
            loadedImages['mainImage'] = getMediaUrl(coverPhoto);
          }

          // Handle all other images/videos that start with img_ or video_
          Object.keys(vehicle).forEach(key => {
            if ((key.startsWith('img_') || key.startsWith('video_')) && vehicle[key]) {
              loadedImages[key] = getMediaUrl(vehicle[key]);
            }
          });
          setExistingImages(loadedImages);

          // 2. Prepare Form Data (Text only) - CLEANUP HERE
          // We must remove keys that correspond to file fields (which come as strings/URLs from API)
          // to avoid sending them as text fields in the PUT/POST request, which causes backend validation errors.
          const cleanVehicle = { ...vehicle };
          const keysToRemove = [
            'mainImage', 'imageUrl', 'main_image', 'images', 'files', 'video', 'videos'
          ];
          
          Object.keys(cleanVehicle).forEach(key => {
            if (
              keysToRemove.includes(key) || 
              key.startsWith('img_') || 
              key.startsWith('video_')
            ) {
              delete cleanVehicle[key];
            }
          });

          const mappedData: VehicleFormData = {
            ...INITIAL_FORM_DATA,
            ...cleanVehicle, 
            price: vehicle.price?.toString() || '',
            category: vehicle.category || '4w',
            vehicleType: vehicle.vehicleType || 'Private',
            year: vehicle.year?.toString() || '',
            mfgYear: vehicle.mfgYear?.toString() || vehicle.year?.toString() || '',
            regYear: vehicle.regYear?.toString() || '',
            odometer: vehicle.odometer?.toString() || '',
            rcAvailable: vehicle.rcAvailable !== undefined ? !!vehicle.rcAvailable : true,
            scraped: !!vehicle.scraped,
            verified: !!vehicle.verified,
          };
          setFormData(mappedData);

        } catch (err) {
          console.error(err);
          setNotification({ type: 'error', message: 'Failed to load details' });
        }
      } else {
        const draft = await loadDraft();
        if (draft) {
          setFormData(draft.data);
          setImages(draft.images);
          setNotification({ type: 'success', message: 'Draft restored' });
          setTimeout(() => setNotification(null), 3000);
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, [id, isEditMode]);

  // Auto-save
  useEffect(() => {
    if (isEditMode || isLoading) return;
    const timer = setTimeout(async () => {
      if (formData.make || formData.model || formData.price || images.mainImage) {
        setDraftStatus('saving');
        await saveDraft(formData, images);
        setDraftStatus('saved');
        setTimeout(() => setDraftStatus('idle'), 2000);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData, images, isEditMode, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof VehicleFormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValueChange = (name: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (key: keyof VehicleImages, file: File | null) => {
    setImages((prev) => ({ ...prev, [key]: file }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (step === 1) {
        if (!formData.make.trim()) newErrors.make = 'Required';
        if (!formData.model.trim()) newErrors.model = 'Required';
        if (!formData.price.trim()) newErrors.price = 'Required';
        if (!formData.mfgYear.trim()) newErrors.mfgYear = 'Required';
        if (!formData.odometer.trim()) newErrors.odometer = 'Required';
        // Only require RC photo if RC is available AND not already uploaded/existing
        if (formData.rcAvailable && !images.img_rc && !existingImages.img_rc) {
             newErrors.img_rc = "Required";
             isValid = false;
        }
    }

    // Common check for issue remarks
    const checkIssues = (fields: {status: keyof VehicleFormData, remark: keyof VehicleFormData, label: string}[]) => {
      fields.forEach(field => {
        if (formData[field.status] === 'Issue' && !formData[field.remark]?.toString().trim()) {
           newErrors[field.remark] = `${field.label} remark is required`;
           isValid = false;
        }
      });
    };

    if (step === 3) {
      checkIssues([
        {status: 'insp_power_window_status', remark: 'insp_power_window_remark', label: 'Power Window'},
        {status: 'insp_airbag_status', remark: 'insp_airbag_remark', label: 'Airbag'},
        {status: 'insp_electrical_status', remark: 'insp_electrical_remark', label: 'Electrical'},
        {status: 'insp_interior_status', remark: 'insp_interior_remark', label: 'Interior'},
        {status: 'insp_seat_status', remark: 'insp_seat_remark', label: 'Seat'},
      ]);
    }

    if (step === 4) {
       checkIssues([
         {status: 'insp_engine_assembly_status', remark: 'insp_engine_assembly_remark', label: 'Engine Assembly'},
         {status: 'insp_battery_status', remark: 'insp_battery_remark', label: 'Battery'},
         {status: 'insp_engine_oil_status', remark: 'insp_engine_oil_remark', label: 'Engine Oil'},
         {status: 'insp_coolant_status', remark: 'insp_coolant_remark', label: 'Coolant'},
         {status: 'insp_engine_mounting_status', remark: 'insp_engine_mounting_remark', label: 'Mounting'},
         {status: 'insp_engine_sound_status', remark: 'insp_engine_sound_remark', label: 'Engine Sound'},
         {status: 'insp_engine_smoke_status', remark: 'insp_engine_smoke_remark', label: 'Engine Smoke'},
         {status: 'insp_blowby_status', remark: 'insp_blowby_remark', label: 'Blowby'},
         {status: 'insp_back_compression_status', remark: 'insp_back_compression_remark', label: 'Back Compression'},
         {status: 'insp_clutch_status', remark: 'insp_clutch_remark', label: 'Clutch'},
         {status: 'insp_gear_shifting_status', remark: 'insp_gear_shifting_remark', label: 'Gear Shifting'},
       ]);
    }

    if (step === 5) {
      checkIssues([
        {status: 'insp_suspension_status', remark: 'insp_suspension_remark', label: 'Suspension'},
        {status: 'insp_steering_status', remark: 'insp_steering_remark', label: 'Steering'},
        {status: 'insp_brake_status', remark: 'insp_brake_remark', label: 'Brakes'},
      ]);
    }

    if (step === 6) {
      checkIssues([
        {status: 'insp_ac_status', remark: 'insp_ac_remark', label: 'AC'},
        {status: 'insp_heater_status', remark: 'insp_heater_remark', label: 'Heater'},
        {status: 'insp_climate_control_status', remark: 'insp_climate_control_remark', label: 'Climate Control'},
      ]);
    }

    if (step === 7) {
        // Require Main Image only if neither new file nor existing URL exists
        const hasMainImage = images.mainImage || existingImages.mainImage;
        if (!hasMainImage) {
            newErrors.mainImage = 'Cover photo is required';
            isValid = false;
        }
    }

    if (Object.keys(newErrors).length > 0) isValid = false;
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        setNotification({ type: 'error', message: 'Please fix the errors to proceed' });
        setTimeout(() => setNotification(null), 2000);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUploadProgress(0);
    setNotification(null);

    if (formData.mfgYear) { formData.year = formData.mfgYear; }

    if (!validateStep(7)) {
        setNotification({ type: 'error', message: 'Please add a cover photo' });
        setIsSubmitting(false);
        return;
    }

    // Prepare submission data
    const submissionImages = { ...images };
    if (formData.hypothecation !== 'Close') submissionImages.img_noc = null;
    if (!formData.rcAvailable) submissionImages.img_rc = null;
    
    try {
      if (isEditMode && id) {
        await api.updateVehicle(id, formData, submissionImages, (p) => setUploadProgress(p));
      } else {
        await api.addVehicle(formData, submissionImages, (p) => setUploadProgress(p));
        await clearDraft();
      }
      setNotification({ type: 'success', message: isEditMode ? 'Vehicle Updated' : 'Listing Published' });
      setTimeout(() => isEditMode ? navigate(`/stock/${id}`) : navigate('/stock'), 1500);
    } catch (error: any) {
      console.error(error);
      setNotification({ type: 'error', message: error.message || 'Submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitle = () => {
      switch(currentStep) {
          case 1: return 'Vehicle Details';
          case 2: return 'Exterior & Tyres';
          case 3: return 'Interior & Electrical';
          case 4: return 'Engine & Transmission';
          case 5: return 'Steering & Suspension';
          case 6: return 'Air Conditioning';
          case 7: return 'Gallery';
          case 8: return 'Review';
          default: return '';
      }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <div className="w-64 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-6">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * uploadProgress) / 100} strokeLinecap="round" className="transition-all duration-300 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xl">{Math.round(uploadProgress)}%</div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Uploading Data...</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-[200px]">Check your console to see the exact API payload parameters.</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 pb-32">
        {notification && (
          <div className={`fixed top-16 left-4 right-4 z-[60] p-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up max-w-md mx-auto ${notification.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 h-14 flex items-center justify-between transition-all">
             <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-black/5 rounded-full text-slate-700 transition-colors active:scale-95">
                <ArrowLeft className="w-5 h-5" />
             </button>
             <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Step {currentStep} of {totalSteps}</span>
                 <span className="text-sm font-bold text-slate-900 leading-none">{stepTitle()}</span>
             </div>
             <div className="w-9 h-9 flex items-center justify-center">
                 {draftStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin text-slate-400"/> : 
                  draftStatus === 'saved' ? <CheckCircle2 className="w-5 h-5 text-emerald-500 transition-all"/> : 
                  <div className="w-5 h-5" />} 
             </div>
        </div>

        {/* Progress Line */}
        <div className="fixed top-14 left-0 right-0 h-1 bg-slate-100 z-30">
            <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
        </div>

        <div className="max-w-lg mx-auto p-4 space-y-6">
          
          {/* STEP 1: CAR DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-slide-up">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                    <SectionHeader title="Basic Info" icon={<Car className="w-5 h-5"/>} />
                    <div className="grid grid-cols-2 gap-3">
                        <SegmentedControl 
                            label="Category"
                            value={formData.category}
                            onChange={(val) => handleValueChange('category', val)}
                            options={[{ value: '4w', label: 'Car' }, { value: '2w', label: 'Bike' }]}
                        />
                         <SegmentedControl 
                            label="Type"
                            value={formData.vehicleType}
                            onChange={(val) => handleValueChange('vehicleType', val)}
                            options={[{ value: 'Private', label: 'Private' }, { value: 'Commercial', label: 'Comm.' }]}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Make" name="make" value={formData.make} onChange={handleChange} placeholder="e.g. Hyundai" error={errors.make} />
                        <InputField label="Model" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Creta" error={errors.model} />
                    </div>
                    <InputField label="Variant" name="variant" value={formData.variant} onChange={handleChange} placeholder="e.g. SX (O)" error={errors.variant} />
                    <InputField label="Asking Price (₹)" name="price" type="number" inputMode="numeric" value={formData.price} onChange={handleChange} placeholder="0" error={errors.price} className="font-bold text-slate-900 border-emerald-200 bg-emerald-50/50 focus:border-emerald-500 focus:ring-emerald-100" icon={<Banknote className="w-4 h-4 text-emerald-600" />} />
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                     <SectionHeader title="Specifications" icon={<Settings className="w-5 h-5"/>} />
                    <PillSelector label="Fuel Type" value={formData.fuelType} onChange={(val) => handleValueChange('fuelType', val)} options={[{value:'Petrol',label:'Petrol'},{value:'Diesel',label:'Diesel'},{value:'CNG',label:'CNG'},{value:'Electric',label:'EV'}]} />
                    <div className="grid grid-cols-2 gap-3">
                        <SegmentedControl label="Transmission" value={formData.transmission} onChange={(val) => handleValueChange('transmission', val)} options={[{value:'Manual',label:'Manual'},{value:'Automatic',label:'Auto'}]} />
                        <InputField label="Odometer" name="odometer" type="number" inputMode="numeric" value={formData.odometer} onChange={handleChange} placeholder="0" suffix="km" error={errors.odometer} />
                    </div>
                     <InputField label="Color" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. White" icon={<Palette className="w-4 h-4" />} />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                     <SectionHeader title="Registration" icon={<FileText className="w-5 h-5"/>} />
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Mfg Year" name="mfgYear" type="number" inputMode="numeric" value={formData.mfgYear} onChange={handleChange} placeholder="YYYY" error={errors.mfgYear} />
                        <InputField label="Reg Year" name="regYear" type="number" inputMode="numeric" value={formData.regYear} onChange={handleChange} placeholder="YYYY" error={errors.regYear} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                         <InputField label="Reg No." name="regNumber" value={formData.regNumber} onChange={handleChange} placeholder="MH01AB1234" className="uppercase font-mono" />
                         <InputField label="RTO State" name="rtoState" value={formData.rtoState} onChange={handleChange} placeholder="e.g. MH" className="uppercase" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <InputField label="Chassis No" name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} placeholder="Long alphanumeric..." className="uppercase text-xs" />
                         <InputField label="Fitness Valid Upto" name="validUpto" type="date" value={formData.validUpto} onChange={handleChange} />
                    </div>

                    <PillSelector label="Ownership" value={formData.ownership} onChange={(val) => handleValueChange('ownership', val)} options={[{value:'1st Owner',label:'1st'},{value:'2nd Owner',label:'2nd'},{value:'3rd Owner',label:'3rd'},{value:'4th+',label:'4+'}]} />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                     <SectionHeader title="Legal & Finance" icon={<ShieldCheck className="w-5 h-5"/>} />
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tax Type</label>
                        <SegmentedControl label="" value={formData.tax} onChange={(val) => handleValueChange('tax', val)} options={[{ value: 'LTT', label: 'Life Time' }, { value: 'OTT', label: 'One Time' }]} />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:border-slate-200">
                        <Toggle label="RC Available" description="Original Registration Certificate available?" checked={formData.rcAvailable} onChange={(val) => setFormData(p => ({...p, rcAvailable: val}))} />
                        {formData.rcAvailable && (
                            <div className="mt-4 pt-4 border-t border-slate-200/50 animate-fade-in">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Upload RC Photo</label>
                                <div className="w-28">
                                    <ImageInput config={{ key: 'img_rc', label: 'RC Front' }} file={images.img_rc} existingUrl={existingImages.img_rc} onChange={handleImageChange} error={errors.img_rc} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 transition-colors hover:border-slate-200">
                         <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Hypothecation</label>
                        <SegmentedControl label="" value={formData.hypothecation} onChange={(val) => handleValueChange('hypothecation', val)} options={[{ value: 'Open', label: 'Open' }, { value: 'Close', label: 'Closed' }, { value: 'NA', label: 'N/A' }]} />
                        {formData.hypothecation === 'Close' && (
                            <div className="mt-4 pt-4 border-t border-slate-200/50 animate-fade-in">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Upload NOC</label>
                                <div className="w-28">
                                    <ImageInput config={{ key: 'img_noc', label: 'Bank NOC' }} file={images.img_noc} existingUrl={existingImages.img_noc} onChange={handleImageChange} error={errors.img_noc} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                         <SelectField label="Insurance" name="insurance" value={formData.insurance} onChange={handleChange} options={[{value:'',label:'Select Status'},{value:'Comprehensive',label:'Comprehensive'},{value:'Third Party',label:'Third Party'},{value:'Expired',label:'Expired'}]} />
                         {formData.insurance && formData.insurance !== 'Expired' && (
                             <InputField label="Expiry Date" name="insuranceExpiry" type="date" value={formData.insuranceExpiry} onChange={handleChange} />
                        )}
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                        <SelectField label="Service History" name="serviceHistory" value={formData.serviceHistory} onChange={handleChange} options={[{value:'Available',label:'Available'},{value:'Not Available',label:'Not Available'}]} />
                        <Toggle label="Vehicle Scrapped" description="Mark as scrap vehicle?" checked={formData.scraped} onChange={(val) => setFormData(p => ({...p, scraped: val}))} />
                    </div>
                </div>
            </div>
          )}

          {/* STEP 2: EXTERIOR & INSPECTION */}
          {currentStep === 2 && (
             <div className="space-y-5 animate-slide-up">
               <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm flex items-start gap-3 backdrop-blur-sm">
                 <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p>Tap "Issue" if you find damage or repairs. The remark field will appear automatically.</p>
               </div>

               {/* Outer Body */}
               <div className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2"><Car className="w-4 h-4"/> Outer Body</h3>
                 <InspectionItem label="Bumper" statusField="insp_bumper_status" remarkField="insp_bumper_remark" imageKeys={['img_insp_bumper']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Bonnet" statusField="insp_bonnet_status" remarkField="insp_bonnet_remark" imageKeys={['img_insp_bonnet']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Roof" statusField="insp_roof_status" remarkField="insp_roof_remark" imageKeys={['img_insp_roof']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Fender" statusField="insp_fender_status" remarkField="insp_fender_remark" imageKeys={['img_insp_fender']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Doors" statusField="insp_doors_status" remarkField="insp_doors_remark" imageKeys={['img_insp_door_1','img_insp_door_2','img_insp_door_3','img_insp_door_4']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Pillars" statusField="insp_pillars_status" remarkField="insp_pillars_remark" imageKeys={['img_insp_pillar_1','img_insp_pillar_2','img_insp_pillar_3','img_insp_pillar_4','img_insp_pillar_5','img_insp_pillar_6']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Quarter Panel" statusField="insp_quarter_panel_status" remarkField="insp_quarter_panel_remark" imageKeys={['img_insp_quarter_panel']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Dickey Door" statusField="insp_dickey_door_status" remarkField="insp_dickey_door_remark" imageKeys={['img_insp_dickey_door']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
               </div>
               
               {/* Structure & Engine Bay */}
               <div className="space-y-4 mt-8">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2"><Layers className="w-4 h-4"/> Structure</h3>
                 <InspectionItem label="Apron" statusField="insp_apron_status" remarkField="insp_apron_remark" imageKeys={['img_insp_apron_1','img_insp_apron_2']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Apron Leg" statusField="insp_apron_leg_status" remarkField="insp_apron_leg_remark" imageKeys={['img_insp_apron_leg_1','img_insp_apron_leg_2']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Firewall" statusField="insp_firewall_status" remarkField="insp_firewall_remark" imageKeys={['img_insp_firewall']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Cowl Top" statusField="insp_cowl_top_status" remarkField="insp_cowl_top_remark" imageKeys={['img_insp_cowl_top']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Lower Cross Member" statusField="insp_lower_cross_member_status" remarkField="insp_lower_cross_member_remark" imageKeys={['img_insp_lower_cross_member']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Upper Cross Member" statusField="insp_upper_cross_member_status" remarkField="insp_upper_cross_member_remark" imageKeys={['img_insp_upper_cross_member']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
               </div>

               {/* Glass & Lights */}
               <div className="space-y-4 mt-8">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2"><Box className="w-4 h-4"/> Glass & Lights</h3>
                 <InspectionItem label="Front Show" statusField="insp_front_show_status" remarkField="insp_front_show_remark" allowNA imageKeys={['img_insp_front_show']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Windshield" statusField="insp_windshield_status" remarkField="insp_windshield_remark" allowNA imageKeys={['img_insp_windshield']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="ORVM" statusField="insp_orvm_status" remarkField="insp_orvm_remark" imageKeys={['img_insp_orvm_1','img_insp_orvm_2']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Lights" statusField="insp_lights_status" remarkField="insp_lights_remark" imageKeys={['img_insp_lights_1','img_insp_lights_2']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 <InspectionItem label="Fog Lights" statusField="insp_fog_lights_status" remarkField="insp_fog_lights_remark" allowNA imageKeys={['img_insp_fog_lights_1','img_insp_fog_lights_2']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
               </div>

               {/* Wheels & Tyres */}
               <div className="space-y-4 mt-8">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2"><Disc className="w-4 h-4"/> Tyres & Wheels</h3>
                 <InspectionItem label="Alloy Wheels" statusField="insp_alloy_wheels_status" remarkField="insp_alloy_wheels_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} />
                 
                 <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-slate-800">Tyre Condition</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => handleValueChange('insp_wheels_status', 'OK')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${formData.insp_wheels_status === 'OK' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>OK</button>
                            <button onClick={() => handleValueChange('insp_wheels_status', 'Issue')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${formData.insp_wheels_status === 'Issue' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>Issue</button>
                        </div>
                    </div>
                    {formData.insp_wheels_status === 'Issue' && (
                        <textarea
                            value={formData.insp_wheels_remark}
                            onChange={(e) => handleValueChange('insp_wheels_remark', e.target.value)}
                            placeholder="Describe tyre/wheel issues..."
                            className="w-full p-3 mb-4 text-sm bg-red-50 border border-red-100 rounded-xl focus:outline-none focus:border-red-300 text-slate-700 h-20 resize-none animate-fade-in"
                        />
                    )}
                    <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-1"><ImageInput config={{ key: 'img_tyre_1', label: 'FL' }} file={images.img_tyre_1} existingUrl={existingImages.img_tyre_1} onChange={handleImageChange} /></div>
                        <div className="col-span-1"><ImageInput config={{ key: 'img_tyre_2', label: 'FR' }} file={images.img_tyre_2} existingUrl={existingImages.img_tyre_2} onChange={handleImageChange} /></div>
                        <div className="col-span-1"><ImageInput config={{ key: 'img_tyre_3', label: 'RL' }} file={images.img_tyre_3} existingUrl={existingImages.img_tyre_3} onChange={handleImageChange} /></div>
                        <div className="col-span-1"><ImageInput config={{ key: 'img_tyre_4', label: 'RR' }} file={images.img_tyre_4} existingUrl={existingImages.img_tyre_4} onChange={handleImageChange} /></div>
                        <div className="col-span-1"><ImageInput config={{ key: 'img_tyre_optional', label: 'Spare' }} file={images.img_tyre_optional} existingUrl={existingImages.img_tyre_optional} onChange={handleImageChange} /></div>
                    </div>
                 </div>
               </div>
             </div>
          )}

          {/* STEP 3: ELECTRICAL & INTERIOR */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-slide-up">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                 <p>Inspect interior components and electrical systems. Mark as "Issue" and describe if something is not working.</p>
               </div>

               <div className="space-y-4">
                   <div className="flex items-center gap-2 px-1 mb-2">
                      <Zap className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Electricals</h3>
                   </div>
                   <InspectionItem label="Power Windows" statusField="insp_power_window_status" remarkField="insp_power_window_remark" allowNA formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_power_window_remark} />
                   <InspectionItem label="Airbags" statusField="insp_airbag_status" remarkField="insp_airbag_remark" allowNA formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_airbag_remark} />
                   <InspectionItem label="General Electricals" statusField="insp_electrical_status" remarkField="insp_electrical_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_electrical_remark} />
                   <InspectionItem label="Music System" statusField="insp_music_system_status" remarkField="insp_music_system_remark" allowNA formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_music_system_remark} />
                   <InspectionItem label="Camera / Sensors" statusField="insp_camera_sensor_status" remarkField="insp_camera_sensor_remark" allowNA formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_camera_sensor_remark} />
               </div>

               <div className="space-y-4 mt-8">
                   <div className="flex items-center gap-2 px-1 mb-2">
                      <Armchair className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interior</h3>
                   </div>
                   <InspectionItem label="Interior Condition" statusField="insp_interior_status" remarkField="insp_interior_remark" allowNA formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_interior_remark} />
                   <InspectionItem label="Seats" statusField="insp_seat_status" remarkField="insp_seat_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_seat_remark} />
                   <InspectionItem label="Sunroof" statusField="insp_sunroof_status" remarkField="insp_sunroof_remark" allowNA formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_sunroof_remark} />
               </div>
            </div>
          )}

          {/* STEP 4: ENGINE & TRANSMISSION (NEW) */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-slide-up">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-orange-800 text-sm flex items-start gap-3">
                 <Flame className="w-5 h-5 shrink-0 mt-0.5" />
                 <p>Perform engine & transmission checks. Record videos for sound, smoke, and blowby (max 10s).</p>
               </div>

               <div className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2"><Settings className="w-4 h-4"/> Engine Health</h3>
                 <InspectionItem label="Engine Assembly" statusField="insp_engine_assembly_status" remarkField="insp_engine_assembly_remark" isEnginePart imageKeys={['img_insp_engine_assembly']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_engine_assembly_remark} />
                 <InspectionItem label="Battery" statusField="insp_battery_status" remarkField="insp_battery_remark" isEnginePart imageKeys={['img_insp_battery']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_battery_remark} />
                 <InspectionItem label="Engine Oil Condition" statusField="insp_engine_oil_status" remarkField="insp_engine_oil_remark" isEnginePart imageKeys={['img_insp_engine_oil']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_engine_oil_remark} />
                 <InspectionItem label="Engine Oil Level" statusField="insp_engine_oil_level_status" remarkField="insp_engine_oil_level_remark" isEnginePart imageKeys={['img_insp_engine_oil_level']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_engine_oil_level_remark} />
                 <InspectionItem label="Coolant" statusField="insp_coolant_status" remarkField="insp_coolant_remark" isEnginePart imageKeys={['img_insp_coolant']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_coolant_remark} />
                 <InspectionItem label="Engine Mounting" statusField="insp_engine_mounting_status" remarkField="insp_engine_mounting_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_engine_mounting_remark} />
               </div>

               <div className="space-y-4 mt-8">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2"><Video className="w-4 h-4"/> Live Tests & Video</h3>
                 {/* Video Fields */}
                 <InspectionItem label="Engine Sound" statusField="insp_engine_sound_status" remarkField="insp_engine_sound_remark" videoKeys={['video_insp_engine_sound']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_engine_sound_remark} />
                 <InspectionItem label="Engine Smoke" statusField="insp_engine_smoke_status" remarkField="insp_engine_smoke_remark" videoKeys={['video_insp_engine_smoke']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_engine_smoke_remark} />
                 <InspectionItem label="Blowby (Back Compression)" statusField="insp_blowby_status" remarkField="insp_blowby_remark" videoKeys={['video_insp_blowby']} formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_blowby_remark} />
               </div>

               <div className="space-y-4 mt-8">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-2"><Cog className="w-4 h-4"/> Transmission</h3>
                 <InspectionItem label="Clutch Operation" statusField="insp_clutch_status" remarkField="insp_clutch_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_clutch_remark} />
                 <InspectionItem label="Gear Shifting" statusField="insp_gear_shifting_status" remarkField="insp_gear_shifting_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_gear_shifting_remark} />
                 {/* Back compression text field only as separate from video if needed, but included in Blowby video usually. Added separately as per prompt request "back compression(yes/no + remark)" */}
                 <InspectionItem label="Back Compression (Observation)" statusField="insp_back_compression_status" remarkField="insp_back_compression_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_back_compression_remark} />
               </div>
            </div>
          )}

          {/* STEP 5: STEERING & SUSPENSION (NEW) */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-slide-up">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm flex items-start gap-3">
                 <Disc className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                 <p>Check suspension, steering, and braking systems.</p>
               </div>
               <div className="space-y-4">
                 <InspectionItem label="Suspension" statusField="insp_suspension_status" remarkField="insp_suspension_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_suspension_remark} />
                 <InspectionItem label="Steering" statusField="insp_steering_status" remarkField="insp_steering_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_steering_remark} />
                 <InspectionItem label="Brakes" statusField="insp_brake_status" remarkField="insp_brake_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_brake_remark} />
               </div>
            </div>
          )}

          {/* STEP 6: AIR CONDITIONING (NEW) */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-slide-up">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm flex items-start gap-3">
                 <Fan className="w-5 h-5 shrink-0 mt-0.5" />
                 <p>Verify AC and heating performance.</p>
               </div>
               <div className="space-y-4">
                 <InspectionItem label="AC Cooling" statusField="insp_ac_status" remarkField="insp_ac_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_ac_remark} />
                 <InspectionItem label="Heater" statusField="insp_heater_status" remarkField="insp_heater_remark" formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_heater_remark} />
                 <InspectionItem label="Climate Control" statusField="insp_climate_control_status" remarkField="insp_climate_control_remark" allowNA formData={formData} setFormData={setFormData} images={images} setImages={setImages} existingImages={existingImages} error={errors.insp_climate_control_remark} />
               </div>
            </div>
          )}

          {/* STEP 7: GALLERY */}
          {currentStep === 7 && (
             <div className="space-y-5 animate-slide-up">
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Vehicle Photos</h3>
                            <p className="text-[10px] text-slate-500">Tap + to upload</p>
                        </div>
                      </div>
                      <ImageSection images={images} setImages={setImages} mainImageError={errors.mainImage} existingImages={existingImages} />
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <TextAreaField 
                        label="General Remarks" 
                        name="remarks"
                        placeholder="Any additional details about the vehicle..."
                        rows={3}
                        value={formData.remarks}
                        onChange={handleChange}
                    />
                  </div>
             </div>
          )}

          {/* STEP 8: FINAL REVIEW */}
          {currentStep === 8 && (
              <div className="space-y-5 animate-slide-up">
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                      <div className="text-center py-6">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm ${totalIssues > 0 ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                              {totalIssues > 0 ? <Wrench className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Ready to Publish!</h3>
                          <p className="text-sm text-slate-500 px-6 mt-1">Review the details below.</p>
                      </div>

                      {/* INSPECTION SUMMARY */}
                      <div className={`p-4 rounded-xl border flex items-center justify-between ${totalIssues > 0 ? 'bg-orange-50 border-orange-100' : 'bg-emerald-50 border-emerald-100'}`}>
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${totalIssues > 0 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                               {totalIssues > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                            </div>
                            <div>
                               <h4 className={`text-sm font-bold ${totalIssues > 0 ? 'text-orange-900' : 'text-emerald-900'}`}>
                                  {totalIssues > 0 ? 'Attention Needed' : 'Excellent Condition'}
                               </h4>
                               <p className={`text-xs ${totalIssues > 0 ? 'text-orange-700' : 'text-emerald-700'}`}>
                                  {totalIssues > 0 ? `${totalIssues} issues found` : 'No major issues flagged'}
                               </p>
                            </div>
                         </div>
                         <div className={`text-2xl font-bold ${totalIssues > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                            {totalIssues}
                         </div>
                      </div>

                      <div className="space-y-4 pt-2">
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Set Initial Status</label>
                          <div className="grid grid-cols-1 gap-3">
                              {[
                                  {id: 'For Sale', icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200'},
                                  {id: 'Sold', icon: CheckCircle2, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200'},
                                  {id: 'Paused', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200'}
                              ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={() => handleValueChange('status', opt.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${formData.status === opt.id ? `${opt.bg} ${opt.border} ring-1 ring-offset-0 ${opt.color.replace('text', 'ring')}` : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                                  >
                                      <div className={`p-2 rounded-lg bg-white shadow-sm ${opt.color}`}>
                                          <opt.icon className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1 text-left">
                                          <div className={`text-sm font-bold ${formData.status === opt.id ? 'text-slate-900' : 'text-slate-600'}`}>{opt.id}</div>
                                      </div>
                                      {formData.status === opt.id && <div className={`w-5 h-5 rounded-full border-[5px] ${opt.color.replace('text', 'border')}`} />}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <Toggle 
                        label="Verified Badge" 
                        description="Mark this vehicle as verified"
                        checked={formData.verified} 
                        onChange={(val) => setFormData(p => ({...p, verified: val}))} 
                        />
                      </div>
                  </div>
              </div>
          )}

          {/* INLINE ACTION BUTTONS */}
          <div className="flex gap-3 pt-6 pb-4">
             {currentStep > 1 && (
                <button
                    onClick={handleBack}
                    className="flex-none w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors active:scale-95 flex items-center justify-center shadow-sm"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
             )}
             
             {currentStep < totalSteps ? (
                 <button
                    onClick={handleNext}
                    className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-bold text-base shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    Next Step <ArrowRight className="w-5 h-5" />
                </button>
             ) : (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                    {isEditMode ? 'Update' : 'Publish'}
                </button>
             )}
          </div>
        </div>
      </div>
    </>
  );
};
