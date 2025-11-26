import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AnalysisResult from './components/AnalysisResult';
import { analyzePlantImage } from './services/geminiService';
import { AnalysisState, PlantAnalysis } from './types';
import { AlertCircle, ArrowRight } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<AnalysisState>(AnalysisState.IDLE);
  const [result, setResult] = useState<PlantAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (file: File) => {
    setStatus(AnalysisState.UPLOADING);
    setError(null);
    setResult(null);

    // Short delay to show loading state UI transition properly
    setTimeout(async () => {
      try {
        setStatus(AnalysisState.ANALYZING);
        const analysis = await analyzePlantImage(file);
        setResult(analysis);
        setStatus(AnalysisState.SUCCESS);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred.');
        setStatus(AnalysisState.ERROR);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Hero Section - Only show when IDLE */}
        {status === AnalysisState.IDLE && (
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Identify Plant Diseases <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Instantly with AI
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Upload a photo of your plant or leaf. Our advanced Gemini AI model will diagnose the issue and recommend treatment in seconds.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mb-12">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600 font-bold">1</div>
                  <h3 className="font-semibold text-lg mb-2">Upload Photo</h3>
                  <p className="text-slate-500 text-sm">Take a clear picture of the affected leaf or the entire plant.</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 font-bold">2</div>
                  <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                  <p className="text-slate-500 text-sm">Our deep learning model scans for symptoms and identifies diseases.</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600 font-bold">3</div>
                  <h3 className="font-semibold text-lg mb-2">Get Cure</h3>
                  <p className="text-slate-500 text-sm">Receive detailed diagnosis and organic/chemical treatment options.</p>
               </div>
            </div>
          </div>
        )}

        <ImageUpload 
          onImageSelected={handleImageSelected} 
          isLoading={status === AnalysisState.ANALYZING || status === AnalysisState.UPLOADING} 
        />

        {status === AnalysisState.ERROR && (
          <div className="max-w-xl mx-auto mt-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
             <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
             <div>
               <h3 className="font-semibold text-red-800">Analysis Failed</h3>
               <p className="text-red-600 text-sm mt-1">{error}</p>
               <button 
                 onClick={() => setStatus(AnalysisState.IDLE)}
                 className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
               >
                 Try Again
               </button>
             </div>
          </div>
        )}

        {status === AnalysisState.SUCCESS && result && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Analysis Report</h3>
              <button 
                onClick={() => setStatus(AnalysisState.IDLE)}
                className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                Analyze Another <ArrowRight size={16} />
              </button>
            </div>
            <AnalysisResult result={result} />
          </div>
        )}

      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} FloraGuard. Powered by Google Gemini AI.</p>
          <p className="mt-2 text-xs">Disclaimer: This tool provides recommendations based on AI analysis. Always consult with a professional botanist for critical agricultural decisions.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
