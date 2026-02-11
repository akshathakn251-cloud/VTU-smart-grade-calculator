import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, CloudLightning } from 'lucide-react';
import { parseResultPDF } from '../services/geminiService';
import { StudentResult } from '../types';

interface PdfUploaderProps {
  onResultParsed: (result: StudentResult) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onResultParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or an Image file of your results.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        
        const result = await parseResultPDF(base64Content, file.type);
        onResultParsed(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setIsLoading(false);
      };
    } catch (e: any) {
      // Display the actual error message (e.g. "API Key not found")
      setError(e.message || "AI parsing failed. Please try manual entry or a clearer image.");
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative group border-4 border-dashed rounded-3xl p-10 transition-all duration-300 ease-in-out text-center backdrop-blur-sm
          ${isDragging ? 'border-blue-500 bg-blue-50/80 scale-105 shadow-xl' : 'border-indigo-200 bg-white/40 hover:border-indigo-400 hover:bg-white/60 hover:shadow-lg'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />
        
        <div className="flex flex-col items-center justify-center gap-6 relative z-10">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin relative z-10" />
              </div>
              <p className="text-xl font-bold text-indigo-900 mt-6">AI is Analyzing...</p>
              <p className="text-indigo-600 mt-1">Extracting data from your marks card</p>
            </div>
          ) : (
            <>
              <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-2 transition-all duration-500
                ${isDragging ? 'bg-blue-600 rotate-12 scale-110' : 'bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-300'}
              `}>
                <CloudLightning className="h-12 w-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Upload Result</h3>
                <p className="text-gray-600 max-w-sm mx-auto mt-2">
                  Drag & drop PDF/Image or <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse</span>
                </p>
              </div>
              
              <div className="flex gap-3 mt-2">
                 <span className="px-3 py-1 bg-white/50 border border-indigo-100 rounded-full text-xs font-medium text-indigo-600">PDF</span>
                 <span className="px-3 py-1 bg-white/50 border border-indigo-100 rounded-full text-xs font-medium text-indigo-600">JPG</span>
                 <span className="px-3 py-1 bg-white/50 border border-indigo-100 rounded-full text-xs font-medium text-indigo-600">PNG</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50/90 backdrop-blur border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-800">Upload Failed</h4>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;