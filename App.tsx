import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { VehicleForm } from './components/VehicleForm';
import { Login } from './components/auth/Login';
import { BottomNav, Tab } from './components/layout/BottomNav';
import { Dashboard } from './components/pages/Dashboard';
import { StockList } from './components/pages/StockList';
import { VehicleDetails } from './components/pages/VehicleDetails';
import { Profile } from './components/pages/Profile';
import { Help } from './components/pages/Help';
import { Truck, ArrowLeft } from 'lucide-react';

const AppContent: React.FC<{ userEmail: string; onLogout: () => void }> = ({ userEmail, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (path: string): Tab => {
    if (path === '/' || path === '/home') return 'home';
    if (path === '/stock' || path.startsWith('/stock/')) return 'stock';
    if (path === '/add' || path.startsWith('/edit/')) return 'add';
    if (path === '/profile') return 'profile';
    return 'home'; // Default fallback, though hidden on other pages
  };

  const activeTab = getActiveTab(location.pathname);
  // Hide header on sub-pages like help or vehicle details if they have their own headers
  const isSubPage = location.pathname === '/help';
  // Check if it is a detail page to optionally change header behavior
  const isDetailPage = location.pathname.startsWith('/stock/') && location.pathname !== '/stock';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Mobile-like Header - Hide on Detail Page as it has its own header on mobile */}
      {!isDetailPage && (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-sm">
          {isSubPage ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="p-1 -ml-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold text-slate-900">
                {location.pathname === '/help' && 'Help & Support'}
              </h1>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">
                {activeTab === 'home' && 'Dashboard'}
                {activeTab === 'stock' && 'My Inventory'}
                {(activeTab === 'add' && location.pathname.startsWith('/edit')) ? 'Edit Vehicle' : (activeTab === 'add' ? 'New Inventory' : '')}
                {activeTab === 'profile' && 'My Profile'}
              </h1>
            </div>
          )}

          {!isSubPage && activeTab === 'profile' && (
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              <img src={`https://ui-avatars.com/api/?name=${userEmail}&background=random`} alt="User" />
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main className={`p-4 md:p-6 lg:p-8 min-h-[calc(100vh-8rem)] ${isDetailPage ? 'pt-4' : ''}`}>
        <Routes>
          <Route path="/" element={<Dashboard onNavigateToAdd={() => navigate('/add')} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/stock" element={<StockList />} />
          <Route path="/stock/:id" element={<VehicleDetails />} />
          <Route path="/add" element={<VehicleForm />} />
          <Route path="/edit/:id" element={<VehicleForm />} />
          <Route path="/profile" element={<Profile userEmail={userEmail} onLogout={onLogout} />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>

      {/* Bottom Navigation - Hidden on sub-pages */}
      {!isSubPage && !isDetailPage && (
        <BottomNav 
          currentTab={activeTab} 
          onTabChange={(tab) => {
            if (tab === 'home') navigate('/');
            else if (tab === 'stock') navigate('/stock');
            else if (tab === 'add') navigate('/add');
            else if (tab === 'profile') navigate('/profile');
          }} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check for existing session (mock)
  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      setUserEmail(session);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem('user_session', email);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setIsAuthenticated(false);
    setUserEmail('');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <AppContent userEmail={userEmail} onLogout={handleLogout} />
    </HashRouter>
  );
};

export default App;