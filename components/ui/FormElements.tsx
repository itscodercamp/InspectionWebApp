import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: string | React.ReactNode;
}

export const InputField: React.FC<InputProps> = ({ label, error, icon, suffix, className = '', ...props }) => (
  <div className="w-full group">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="relative transition-all duration-200">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-11' : 'px-4'} ${suffix ? 'pr-12' : 'px-4'} py-3.5 rounded-xl border bg-slate-50/50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none appearance-none disabled:opacity-60 disabled:bg-slate-100 ${
          error ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none select-none bg-slate-100/80 px-2 py-1 rounded">
          {suffix}
        </div>
      )}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1 flex items-center gap-1 animate-fade-in">
      <span className="w-1 h-1 rounded-full bg-red-500"></span> {error}
    </p>}
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextAreaField: React.FC<TextAreaProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full group">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <textarea
      className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none disabled:opacity-60 ${
        error ? 'border-red-300 bg-red-50/50 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  icon?: React.ReactNode;
}

export const SelectField: React.FC<SelectProps> = ({ label, options, error, icon, className = '', ...props }) => (
  <div className="w-full group">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
          {icon}
        </div>
      )}
      <select
        className={`w-full appearance-none ${icon ? 'pl-11' : 'px-4'} py-3.5 rounded-xl border bg-slate-50/50 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none pr-10 cursor-pointer disabled:opacity-60 ${
          error ? 'border-red-300 bg-red-50/50 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{error}</p>}
  </div>
);

interface SegmentedControlProps {
  label: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (value: any) => void;
  error?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ label, options, value, onChange, error }) => (
  <div className="w-full">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 ${
              isActive 
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {opt.icon}
            <span className="truncate">{opt.label}</span>
            {isActive && <Check className="w-3.5 h-3.5 stroke-[3] text-primary" />}
          </button>
        );
      })}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{error}</p>}
  </div>
);

interface PillSelectorProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PillSelector: React.FC<PillSelectorProps> = ({ label, options, value, onChange, error }) => (
  <div className="w-full">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border active:scale-95 ${
              isActive 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{error}</p>}
  </div>
);

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between py-2 group cursor-pointer active:opacity-70 transition-opacity" onClick={() => onChange(!checked)}>
    <div className="flex-1 pr-4">
      <label className="text-sm font-bold text-slate-800 cursor-pointer group-hover:text-primary transition-colors">{label}</label>
      {description && <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{description}</p>}
    </div>
    <button
      type="button"
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? 'bg-primary' : 'bg-slate-300 group-hover:bg-slate-400'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; description?: string }> = ({ title, icon, description }) => (
  <div className="flex items-start gap-4 pb-4 border-b border-slate-100 mb-6">
    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 text-primary rounded-2xl shadow-sm ring-1 ring-blue-100/50 shrink-0">
      {icon}
    </div>
    <div>
      <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none mb-1.5">{title}</h2>
      {description && <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>}
    </div>
  </div>
);