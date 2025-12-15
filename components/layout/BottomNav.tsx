import React from 'react';
import { Home, PlusCircle, User, Car } from 'lucide-react';

export type Tab = 'home' | 'stock' | 'add' | 'profile';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'stock', label: 'Stock', icon: Car },
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 pb-safe z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Tab)}
              className="relative flex flex-col items-center justify-center h-full w-full active:scale-90 transition-transform duration-200 outline-none group"
            >
              {/* Icon Container */}
              <div 
                className={`
                  transition-all duration-300 ease-out mb-1
                  ${isActive 
                    ? 'text-primary -translate-y-0.5' 
                    : 'text-slate-400 group-hover:text-slate-600'
                  }
                `}
              >
                <Icon 
                  className={`w-6 h-6 ${isActive ? 'fill-primary/10 stroke-primary' : 'stroke-current'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              
              {/* Label */}
              <span className={`text-[10px] font-medium transition-colors duration-300 ${
                isActive ? 'text-primary' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};