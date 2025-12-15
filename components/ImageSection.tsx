
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Camera, Trash2, UploadCloud, RefreshCw, Image as ImageIcon, Loader2, AlertCircle, Plus, Video, Play } from 'lucide-react';
import { VehicleImages } from '../types';

interface ImageSectionProps {
  images: VehicleImages;
  setImages: React.Dispatch<React.SetStateAction<VehicleImages>>;
  mainImageError?: string;
  existingImages?: Record<string, string>;
}

export interface ImageFieldConfig {
  key: keyof VehicleImages;
  label: string;
  required?: boolean;
}

export const DETAILED_IMAGES: ImageFieldConfig[] = [
  { key: 'img_front', label: 'Front' },
  { key: 'img_front_right', label: 'Front Right' },
  { key: 'img_right', label: 'Right Side' },
  { key: 'img_back_right', label: 'Back Right' },
  { key: 'img_back', label: 'Back' },
  { key: 'img_open_dickey', label: 'Dickey' },
  { key: 'img_back_left', label: 'Back Left' },
  { key: 'img_left', label: 'Left Side' },
  { key: 'img_front_left', label: 'Front Left' },
  { key: 'img_open_bonnet', label: 'Bonnet' },
  { key: 'img_dashboard', label: 'Dashboard' },
  { key: 'img_right_front_door', label: 'RF Door' },
  { key: 'img_right_back_door', label: 'RB Door' },
  { key: 'img_engine', label: 'Engine' },
  { key: 'img_roof', label: 'Roof' },
];

const usePreview = (file: File | null) => {
  const [preview, setPreview] = useState<string | null>(null);
  useLayoutEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return preview;
};

// --- NEW COMPONENT: VIDEO INPUT ---
export const VideoInput: React.FC<{
  config: ImageFieldConfig;
  file: File | null;
  existingUrl?: string;
  error?: string;
  onChange: (key: keyof VehicleImages, file: File | null) => void;
}> = ({ config, file, existingUrl, error, onChange }) => {
  const previewUrl = usePreview(file);
  const displayUrl = previewUrl || existingUrl;
  const [localError, setLocalError] = useState<string | null>(null);
  const activeError = error || localError;
  const hasError = !!activeError && !displayUrl;

  const validateVideo = (file: File): string | null => {
    if (!file.type.startsWith('video/')) return 'Invalid video type';
    if (file.size > 50 * 1024 * 1024) return 'Video too large (>50MB)'; // Approx check, hard to check duration without loading
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      const validationError = validateVideo(selected);
      if (validationError) {
        setLocalError(validationError);
        e.target.value = '';
        return;
      }
    }
    setLocalError(null);
    onChange(config.key, selected);
    e.target.value = '';
  };

  return (
    <div className="relative group">
      <input
        type="file"
        id={`video-${config.key}`}
        className="hidden"
        accept="video/*"
        capture="environment" // trigger native camera
        onChange={handleChange}
      />
      <label
        htmlFor={`video-${config.key}`}
        className={`
          flex flex-col items-center justify-center cursor-pointer border rounded-2xl overflow-hidden relative transition-all duration-200 aspect-square
          ${hasError ? 'border-red-500 bg-red-50' : 'bg-slate-50 border-slate-200 hover:border-primary hover:bg-blue-50'}
        `}
      >
        {displayUrl ? (
          <div className="relative w-full h-full bg-black">
            <video
              src={displayUrl}
              className="w-full h-full object-cover opacity-80"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
               </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
               VIDEO
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
               <Video className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
            </div>
            <span className="text-[10px] font-medium text-slate-500 leading-tight">{config.label}</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Max 10s</span>
          </div>
        )}
      </label>
      
      {hasError && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
          {activeError}
        </div>
      )}
      
      {file && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(config.key, null); }}
          className="absolute -top-2 -right-2 bg-white text-red-500 border border-slate-200 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors z-10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};


export const ImageInput: React.FC<{
  config: ImageFieldConfig;
  file: File | null;
  existingUrl?: string;
  isMain?: boolean;
  error?: string;
  onChange: (key: keyof VehicleImages, file: File | null) => void;
}> = ({ config, file, existingUrl, isMain, error, onChange }) => {
  const previewUrl = usePreview(file);
  const displayUrl = previewUrl || existingUrl;
  const [localError, setLocalError] = useState<string | null>(null);
  const activeError = error || localError;
  const hasError = !!activeError && !displayUrl;
  
  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) return 'Invalid file type';
    if (file.size > 10 * 1024 * 1024) return 'File too large';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      const validationError = validateFile(selected);
      if (validationError) {
        setLocalError(validationError);
        e.target.value = '';
        return;
      }
    }
    setLocalError(null);
    onChange(config.key, selected);
    e.target.value = '';
  };

  return (
    <div className={`relative group ${isMain ? 'w-full' : ''}`}>
      <input
        type="file"
        id={`file-${config.key}`}
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      <label
        htmlFor={`file-${config.key}`}
        className={`
          flex flex-col items-center justify-center cursor-pointer border rounded-2xl overflow-hidden relative transition-all duration-200
          ${isMain ? 'h-56 bg-slate-50 border-slate-200 border-dashed border-2' : 'aspect-square bg-slate-50 border-slate-200'}
          ${hasError ? 'border-red-500 bg-red-50' : 'hover:border-primary hover:bg-blue-50'}
        `}
      >
        {displayUrl ? (
          <div className="relative w-full h-full">
            <img
              src={displayUrl}
              alt={config.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <RefreshCw className="text-white w-6 h-6" />
            </div>
            {isMain && <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Cover Photo</div>}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
            {isMain ? (
              <>
                <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-700">Add Cover Photo</span>
                <span className="text-xs text-slate-400 mt-1">Tap to browse</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1 group-hover:bg-blue-100 group-hover:text-primary transition-colors">
                   <Plus className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                </div>
                <span className="text-[10px] font-medium text-slate-500 leading-tight">{config.label}</span>
              </>
            )}
          </div>
        )}
      </label>
      
      {/* Error Badge */}
      {hasError && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
          {activeError}
        </div>
      )}
      
      {file && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(config.key, null); }}
          className="absolute -top-2 -right-2 bg-white text-red-500 border border-slate-200 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors z-10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const ImageSection: React.FC<ImageSectionProps> = ({ images, setImages, mainImageError, existingImages = {} }) => {
  const handleFileChange = (key: keyof VehicleImages, file: File | null) => {
    setImages((prev) => ({ ...prev, [key]: file }));
  };

  const totalSlots = DETAILED_IMAGES.length + 1;
  let uploadedCount = 0;
  if (images.mainImage || existingImages['mainImage']) uploadedCount++;
  DETAILED_IMAGES.forEach(cfg => { if (images[cfg.key] || existingImages[cfg.key]) uploadedCount++; });
  const progress = (uploadedCount / totalSlots) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
            <span>Gallery Completeness</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
          {uploadedCount} / {totalSlots} Photos
        </div>
      </div>

      {/* Main Image */}
      <div>
         <ImageInput 
            config={{ key: 'mainImage', label: 'Main Display Image' }} 
            isMain 
            file={images.mainImage}
            existingUrl={existingImages['mainImage']}
            error={mainImageError}
            onChange={handleFileChange}
          />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
         {DETAILED_IMAGES.map((config) => (
            <ImageInput 
              key={config.key} 
              config={config} 
              file={images[config.key]}
              existingUrl={existingImages[config.key]}
              onChange={handleFileChange}
            />
          ))}
      </div>
    </div>
  );
};
