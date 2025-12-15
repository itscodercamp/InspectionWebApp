
import React, { useState } from 'react';
import { User, Settings, LogOut, ChevronRight, Shield, FileCheck, X, Moon, Sun, Type, Lock, Smartphone, CheckCircle2, Fingerprint, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toggle, SegmentedControl } from '../ui/FormElements';

interface ProfileProps {
  userEmail: string;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'preferences' | 'privacy' | 'guidelines' | null>(null);

  // Settings State
  const [theme, setTheme] = useState('Light');
  const [fontSize, setFontSize] = useState('Medium');
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="pb-24 animate-fade-in max-w-lg mx-auto relative">
      {/* Profile Header */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner relative z-10">
          <User className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Admin User</h2>
          <p className="text-sm text-slate-500 font-medium">{userEmail}</p>
          <div className="flex items-center gap-1 mt-1.5">
             <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-100">
               <Shield className="w-3 h-3 mr-1" /> Verified Dealer
             </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Settings Section */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">App Settings</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <button 
              onClick={() => setActiveModal('preferences')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="text-left">
                   <span className="block text-sm font-semibold text-slate-700">App Preferences</span>
                   <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Theme, Font Size</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
            
            <button 
              onClick={() => setActiveModal('privacy')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                   <span className="block text-sm font-semibold text-slate-700">Privacy & Security</span>
                   <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Password, 2FA, Biometrics</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">Resources</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <button 
              onClick={() => setActiveModal('guidelines')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-700">Inspection Guidelines</div>
                  <div className="text-[10px] text-slate-400 font-medium">Standard grading criteria</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-white border border-red-100 text-red-600 p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors shadow-sm active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
        
        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest pb-4">
          Version 1.0.5 (Build 2024)
        </p>
      </div>

      {/* --- MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={closeModal} />
          
          {/* Modal Content */}
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 pointer-events-auto max-h-[85vh] flex flex-col animate-slide-up">
             
             {/* Modal Header */}
             <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  {activeModal === 'preferences' && 'App Preferences'}
                  {activeModal === 'privacy' && 'Privacy & Security'}
                  {activeModal === 'guidelines' && 'Inspection Guidelines'}
                </h3>
                <button onClick={closeModal} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>

             {/* Modal Body */}
             <div className="p-6 overflow-y-auto">
                
                {/* PREFERENCES CONTENT */}
                {activeModal === 'preferences' && (
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                           <Type className="w-4 h-4 text-primary" /> Font Size
                        </div>
                        <SegmentedControl 
                           label=""
                           value={fontSize}
                           onChange={setFontSize}
                           options={[
                              { label: 'Small', value: 'Small', icon: <span className="text-xs">A</span> },
                              { label: 'Medium', value: 'Medium', icon: <span className="text-sm">A</span> },
                              { label: 'Large', value: 'Large', icon: <span className="text-lg">A</span> },
                           ]}
                        />
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                           <Sun className="w-4 h-4 text-primary" /> Color Theme
                        </div>
                        <SegmentedControl 
                           label=""
                           value={theme}
                           onChange={setTheme}
                           options={[
                              { label: 'Light', value: 'Light', icon: <Sun className="w-4 h-4"/> },
                              { label: 'Dark', value: 'Dark', icon: <Moon className="w-4 h-4"/> },
                              { label: 'Auto', value: 'Auto', icon: <Smartphone className="w-4 h-4"/> },
                           ]}
                        />
                     </div>
                  </div>
                )}

                {/* PRIVACY CONTENT */}
                {activeModal === 'privacy' && (
                   <div className="space-y-5">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-white rounded-lg shadow-sm text-slate-700">
                                  <Lock className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-900">Password</p>
                                  <p className="text-xs text-slate-500">Last changed 30 days ago</p>
                               </div>
                            </div>
                            <button className="text-xs font-bold text-primary px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm active:scale-95">Change</button>
                         </div>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-100 p-1">
                          <Toggle 
                             label="Biometric Login" 
                             description="Use FaceID or Fingerprint to sign in" 
                             checked={biometric} 
                             onChange={setBiometric} 
                          />
                          <div className="border-t border-slate-50 my-1"></div>
                          <Toggle 
                             label="Two-Factor Auth" 
                             description="Require OTP for new device logins" 
                             checked={twoFactor} 
                             onChange={setTwoFactor} 
                          />
                      </div>
                      
                      <div className="text-center">
                         <button className="text-xs text-red-500 font-medium hover:underline">Delete Account</button>
                      </div>
                   </div>
                )}

                {/* GUIDELINES CONTENT */}
                {activeModal === 'guidelines' && (
                   <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-xs leading-relaxed border border-blue-100">
                         <strong>Standard Inspection Process:</strong> Always begin inspection from the Front Bumper and move clockwise around the vehicle. Ensure good lighting conditions.
                      </div>

                      <div className="space-y-4">
                         <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Exterior Grading
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                               <li><strong>Original (OK):</strong> Factory paint, no dents, minor scratches allowed (&lt; 2cm).</li>
                               <li><strong>Repainted (Issue):</strong> Any panel with non-factory paint thickness (&gt; 150 microns).</li>
                               <li><strong>Damaged (Issue):</strong> Visible dents, deep scratches, rust, or misalignment.</li>
                            </ul>
                         </div>
                         
                         <div className="h-px bg-slate-100" />

                         <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                               <Eye className="w-4 h-4 text-blue-500" /> Engine & Mechanical
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                               <li><strong>Engine Sound:</strong> Must be idle smooth. Tapping/Knocking is a major issue.</li>
                               <li><strong>Smoke:</strong> White (Coolant), Blue (Oil), Black (Fuel) smoke are all critical issues.</li>
                               <li><strong>Back Compression:</strong> Open oil cap while idling. Any smoke/pressure is an Issue.</li>
                            </ul>
                         </div>

                         <div className="h-px bg-slate-100" />

                         <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                               <Shield className="w-4 h-4 text-purple-500" /> Tyres & Glass
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                               <li><strong>Tyres:</strong> Tread depth must be &gt; 1.6mm (TWI indicator). Uneven wear suggests alignment issues.</li>
                               <li><strong>Glass:</strong> Check for manufacturing year stamp matching vehicle year. Cracks/Chips are issues.</li>
                            </ul>
                         </div>
                      </div>
                   </div>
                )}

             </div>
             
             {/* Modal Footer (Optional close button for mobile convenience) */}
             <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
                <button onClick={closeModal} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md active:scale-95 transition-transform">
                   Done
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
