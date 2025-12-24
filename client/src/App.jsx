import { Toaster } from 'react-hot-toast';
import { Auth, useAuth } from './context/auth';
import LandingPage from './pages/LandingPage';
import SpaceDashboard from './pages/Dashboard';
import LoadingScreen from './components/ui/LoadingScreen';
const AppContent = () => {
  const { session, isLoading } = useAuth();

  if (session?.token) {
      return <SpaceDashboard />;
  }
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
    
    <AppContent />
  </Auth>
);

export default App;