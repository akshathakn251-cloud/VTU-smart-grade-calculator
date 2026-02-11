import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ManualEntry from './components/ManualEntry';
import PdfUploader from './components/PdfUploader';
import ResultsView from './components/ResultsView';
import Login from './components/Login';
import Register from './components/Register';
import { StudentResult, CalculationType, User } from './types';
import { getCurrentUser, logout } from './services/auth';
import { Calculator, FileText, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<CalculationType>(CalculationType.MANUAL);
  const [result, setResult] = useState<StudentResult | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setResult(null);
    setAuthView('login');
  };

  const handleResult = (data: StudentResult) => {
    setResult(data);
  };

  const resetApp = () => {
    setResult(null);
  };

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 backdrop-blur">
        <div className="flex flex-col items-center">
           <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
           <p className="text-indigo-900 font-semibold">Initializing...</p>
        </div>
      </div>
    );
  }

  // Authentication Views
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-[-1]"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-blue-900/80 to-black/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="mb-8 text-center animate-in slide-in-from-top-10 duration-700">
            <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
              VTU Grade Genius
            </h1>
            <p className="text-blue-200 text-lg font-medium">Your academic success companion</p>
          </div>
          {authView === 'login' ? (
            <Login onLogin={setUser} onSwitch={() => setAuthView('register')} />
          ) : (
            <Register onRegister={setUser} onSwitch={() => setAuthView('login')} />
          )}
        </div>
      </div>
    );
  }

  // Main Application Dashboard
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 pb-12">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-grow px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {!result && (
            <div className="mb-12 text-center animate-in slide-in-from-bottom-8 duration-700">
              {/* Hero Card */}
              <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl mb-10 mx-auto max-w-4xl">
                <img 
                   src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                   alt="Students Studying"
                   className="w-full h-64 object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/80 to-transparent">
                   <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow-md">
                     Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Potential</span>
                   </h1>
                   <p className="text-gray-200 text-lg max-w-xl">
                     AI-powered syllabus fetching and result parsing for Visvesvaraya Technological University students.
                   </p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="inline-flex bg-white/40 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/50">
                <button
                  onClick={() => setActiveTab(CalculationType.MANUAL)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform 
                    ${activeTab === CalculationType.MANUAL 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                      : 'text-gray-700 hover:bg-white/50'}`}
                >
                  <Calculator className="h-5 w-5" /> Manual Entry
                </button>
                <button
                  onClick={() => setActiveTab(CalculationType.PDF)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform
                    ${activeTab === CalculationType.PDF 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                      : 'text-gray-700 hover:bg-white/50'}`}
                >
                  <FileText className="h-5 w-5" /> PDF Analysis <span className="bg-teal-400 text-teal-900 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide">New</span>
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="transition-all duration-500 ease-in-out">
            {result ? (
              <ResultsView result={result} onReset={resetApp} />
            ) : (
              <>
                {activeTab === CalculationType.MANUAL ? (
                  <ManualEntry onCalculate={handleResult} />
                ) : (
                  <div className="max-w-3xl mx-auto mt-8">
                    <PdfUploader onResultParsed={handleResult} />
                    <div className="mt-8 glass-panel p-6 rounded-2xl flex items-start gap-4 shadow-md">
                      <div className="p-3 bg-blue-100 rounded-full text-blue-600 shrink-0">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 text-lg mb-1">Magic Parsing</h4>
                         <p className="text-gray-600 leading-relaxed">
                           Upload your official VTU marks card PDF or a clear screenshot. Our advanced AI will detect the semester, subjects, and marks automatically to calculate your GPA instantly.
                         </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;