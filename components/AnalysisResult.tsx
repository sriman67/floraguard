import React from 'react';
import { PlantAnalysis } from '../types';
import { CheckCircle, AlertTriangle, Bug, Droplets, Shield, ThermometerSun, Leaf } from 'lucide-react';

interface AnalysisResultProps {
  result: PlantAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  if (!result.isPlant) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg shadow-sm">
        <div className="flex items-start">
          <AlertTriangle className="text-orange-500 mt-1 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-bold text-orange-800">No Plant Detected</h3>
            <p className="text-orange-700 mt-1">
              Our analysis indicates this image might not contain a plant. Please try uploading a clear photo of a leaf or plant.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isHealthy = result.healthy;
  const healthColor = isHealthy ? 'text-green-600' : 'text-red-600';
  const healthBg = isHealthy ? 'bg-green-100' : 'bg-red-100';
  const healthBorder = isHealthy ? 'border-green-200' : 'border-red-200';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Main Status Card */}
      <div className={`bg-white rounded-2xl p-6 shadow-lg border-l-8 ${isHealthy ? 'border-green-500' : 'border-red-500'}`}>
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mb-2 ${healthBg} ${healthColor}`}>
              {isHealthy ? <CheckCircle size={16} className="mr-1" /> : <AlertTriangle size={16} className="mr-1" />}
              {isHealthy ? 'Healthy Plant' : 'Disease Detected'}
            </div>
            <h2 className="text-3xl font-bold text-slate-900">{result.diseaseName}</h2>
            <p className="text-slate-600 mt-2 text-lg leading-relaxed">{result.description}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-center min-w-[120px]">
            <span className="block text-sm text-slate-500 uppercase tracking-wide font-semibold">Confidence</span>
            <div className="relative pt-2">
               <svg className="w-20 h-20 mx-auto transform -rotate-90">
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                 <circle 
                  cx="40" 
                  cy="40" 
                  r="36" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={226} // 2 * pi * 36
                  strokeDashoffset={226 - (226 * result.confidence) / 100}
                  className={isHealthy ? 'text-green-500' : 'text-red-500'} 
                 />
               </svg>
               <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-slate-700">
                 {Math.round(result.confidence)}%
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Symptoms */}
        {!isHealthy && result.symptoms.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <ThermometerSun className="text-orange-500" size={20} />
                <h3 className="font-semibold text-slate-800">Symptoms</h3>
             </div>
             <ul className="p-6 space-y-3">
               {result.symptoms.map((item, idx) => (
                 <li key={idx} className="flex items-start text-slate-600">
                   <span className="w-2 h-2 mt-2 mr-3 bg-orange-400 rounded-full flex-shrink-0" />
                   {item}
                 </li>
               ))}
             </ul>
          </div>
        )}

        {/* Causes */}
         {!isHealthy && result.causes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Bug className="text-red-500" size={20} />
                <h3 className="font-semibold text-slate-800">Potential Causes</h3>
             </div>
             <ul className="p-6 space-y-3">
               {result.causes.map((item, idx) => (
                 <li key={idx} className="flex items-start text-slate-600">
                   <span className="w-2 h-2 mt-2 mr-3 bg-red-400 rounded-full flex-shrink-0" />
                   {item}
                 </li>
               ))}
             </ul>
          </div>
        )}

        {/* Treatments - Only show if diseased */}
        {!isHealthy && (
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Droplets className="text-blue-500" size={20} />
                <h3 className="font-semibold text-slate-800">Recommended Treatments</h3>
             </div>
             <div className="p-6 grid md:grid-cols-2 gap-8">
                <div>
                   <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                     <Leaf size={16} /> Organic / Biological
                   </h4>
                   <ul className="space-y-2">
                     {result.organicTreatments.map((t, i) => (
                       <li key={i} className="text-slate-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                         {t}
                       </li>
                     ))}
                     {result.organicTreatments.length === 0 && <p className="text-slate-400 text-sm italic">No specific organic treatments listed.</p>}
                   </ul>
                </div>
                <div>
                   <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                     <Shield size={16} /> Chemical / Conventional
                   </h4>
                   <ul className="space-y-2">
                     {result.chemicalTreatments.map((t, i) => (
                       <li key={i} className="text-slate-600 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
                         {t}
                       </li>
                     ))}
                     {result.chemicalTreatments.length === 0 && <p className="text-slate-400 text-sm italic">No specific chemical treatments listed.</p>}
                   </ul>
                </div>
             </div>
          </div>
        )}

        {/* Prevention */}
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${isHealthy ? 'md:col-span-2' : 'md:col-span-2'}`}>
           <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Shield className="text-green-600" size={20} />
              <h3 className="font-semibold text-slate-800">Prevention Tips</h3>
           </div>
           <div className="p-6">
             <div className="grid md:grid-cols-2 gap-4">
               {result.prevention.map((item, idx) => (
                 <div key={idx} className="flex items-start text-slate-600">
                   <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                   <span>{item}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResult;
