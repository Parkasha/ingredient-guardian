import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ScanPage from './components/ScanPage';
import ResultsPage from './components/ResultsPage';
import ProfilePage from './components/ProfilePage';
import DashboardPage from './components/DashboardPage';
import Navigation from './components/Navigation';

export default function App() {
  const [page, setPage] = useState('landing');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({
    type: 'Adult',
    allergies: [],
    medical: [],
    lifestyle: []
  });

  const navigate = (p) => setPage(p);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setScanHistory(prev => [result, ...prev.slice(0, 19)]);
    setPage('results');
  };

  const showNav = ['scan', 'results', 'profile', 'dashboard'].includes(page);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {page === 'landing' && <LandingPage onStart={() => navigate('scan')} />}
      {showNav && (
        <>
          <Navigation currentPage={page} onNavigate={navigate} />
          <div style={{ paddingBottom: '80px' }}>
            {page === 'scan' && <ScanPage onAnalysisComplete={handleAnalysisComplete} userProfile={userProfile} />}
            {page === 'results' && <ResultsPage result={analysisResult} onScanAgain={() => navigate('scan')} userProfile={userProfile} />}
            {page === 'profile' && <ProfilePage profile={userProfile} onUpdate={setUserProfile} />}
            {page === 'dashboard' && <DashboardPage history={scanHistory} onNavigate={navigate} />}
          </div>
        </>
      )}
    </div>
  );
}
