import { Toaster } from 'react-hot-toast';
import { Auth, useAuth } from './context/auth';
import LandingPage from './pages/LandingPage';
import SpaceDashboard from './pages/Dashboard';
import LoadingScreen from './components/ui/LoadingScreen';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Security from './pages/legal/Security';
import Cookies from './pages/legal/Cookies';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const HomeRoute = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (session?.token) {
      return <SpaceDashboard />;
  }

  return <LandingPage />;
};

const App = () => (
  <Auth>
    <BrowserRouter>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: { 
            background: '#1f2937', 
            color: '#fff', 
            borderRadius: '12px',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
            style: { background: '#064E3B', borderColor: '#059669' }
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
            style: { background: '#7F1D1D', borderColor: '#B91C1C' }
          }
        }}
      />
      
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/security" element={<Security />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </Auth>
);

export default App;