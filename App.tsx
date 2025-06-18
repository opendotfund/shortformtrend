
import React from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import KeywordAnalysisPage from './pages/KeywordAnalysisPage';
import Header from './components/Header';
import Footer from './components/Footer';

const KeywordAnalysisPageWrapper: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const navigate = useNavigate();

  if (!keyword) {
    navigate('/');
    return null;
  }
  return <KeywordAnalysisPage keyword={decodeURIComponent(keyword)} />;
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/analysis/:keyword" element={<KeywordAnalysisPageWrapper />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
