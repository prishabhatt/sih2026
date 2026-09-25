import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProcurementProvider } from './context/ProcurementContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SampleDataDrawer } from './components/SampleDataDrawer';
import { ChatbotWidget } from './components/ChatbotWidget';
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { InputFormView } from './views/InputFormView';
import { AnalyzingView } from './views/AnalyzingView';
import { DashboardView } from './views/DashboardView';
import { ReportsView } from './views/ReportsView';
import { SandboxView } from './views/SandboxView';
import { VerifyView } from './views/VerifyView';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout({ children }) {
  const location = useLocation();
  const isCustomOrAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/analyzing' || location.pathname.startsWith('/verify');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200 relative">
      <ScrollToTop />
      {!isCustomOrAuthPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      <SampleDataDrawer />
      <ChatbotWidget />
      {!isCustomOrAuthPage && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProcurementProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<LandingView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/sandbox" element={<SandboxView />} />
                <Route path="/input" element={<InputFormView />} />
                <Route path="/analyzing" element={<AnalyzingView />} />
                <Route path="/dashboard" element={<DashboardView />} />
                <Route path="/reports" element={<ReportsView />} />
                <Route path="/verify/:certificateId" element={<VerifyView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </ProcurementProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
