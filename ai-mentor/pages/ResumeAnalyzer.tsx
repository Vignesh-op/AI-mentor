import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download, X, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeResume } from '../services/geminiService';

const ResumeAnalyzer: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        setTextInput(''); 
        setError(null);
      } else {
        setError('Please upload a PDF or Image file.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!textInput && !selectedFile) {
      setError('Please provide resume content via text or file.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const content = selectedFile || textInput;
      const analysis = await analyzeResume(content, targetRole || 'General Professional');
      setResult(analysis);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadResult = () => {
    if(!result) return;
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `resume-analysis-${targetRole || 'general'}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="h-full overflow-y-auto bg-transparent p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
             Resume AI Analyzer 
             <span className="ml-3 px-3 py-1 bg-violet-600 text-white text-xs font-bold uppercase rounded-full tracking-wide shadow-md shadow-violet-900/50">
                 New: Modernization Engine
             </span>
          </h1>
          <p className="text-gray-300 bg-gray-800/60 backdrop-blur-sm inline-block rounded-lg px-2 py-1">Get instant, professional feedback, industry-specific formatting tips, and ATS optimization.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Target Role Input */}
            <div className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-black/30 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Job Role (Recommended)</label>
              <input
                type="text"
                placeholder="e.g. Senior Product Manager (for keyword gap analysis)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-700 text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-2">Enter a specific role to get a granular keyword gap analysis.</p>
            </div>

            {/* Content Input */}
            <div className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-black/30 border border-gray-700">
               <h3 className="font-semibold text-white mb-4">Resume Content</h3>
               
               {/* File Upload Area */}
               <div 
                 className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                   selectedFile ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-blue-400 hover:bg-gray-700/50'
                 }`}
                 onClick={() => fileInputRef.current?.click()}
               >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept=".pdf,image/*"
                   onChange={handleFileChange}
                 />
                 
                 {selectedFile ? (
                   <div className="flex flex-col items-center">
                     <FileText className="text-blue-400 mb-2" size={32} />
                     <span className="text-sm font-medium text-white break-all">{selectedFile.name}</span>
                     <button 
                       onClick={(e) => { e.stopPropagation(); clearFile(); }}
                       className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center"
                     >
                       <X size={12} className="mr-1" /> Remove
                     </button>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center text-gray-400">
                     <Upload className="mb-2" size={32} />
                     <span className="text-sm font-medium">Click to Upload PDF</span>
                     <span className="text-xs mt-1">or Image file</span>
                   </div>
                 )}
               </div>

               <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-gray-600"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase">Or Paste Text</span>
                  <div className="flex-grow border-t border-gray-600"></div>
               </div>

               <textarea
                 className="w-full h-40 p-3 text-sm rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-700 text-white placeholder-gray-400"
                 placeholder="Paste your resume text here..."
                 value={textInput}
                 onChange={(e) => { setTextInput(e.target.value); setSelectedFile(null); }}
                 disabled={!!selectedFile}
               />

               {error && (
                 <div className="mt-3 flex items-center text-red-400 text-sm bg-red-900/30 p-2 rounded-lg border border-red-800/50">
                   <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                   {error}
                 </div>
               )}

               <button
                 onClick={handleAnalyze}
                 disabled={loading || (!textInput && !selectedFile)}
                 className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/50 hover:shadow-indigo-800/50 transform hover:-translate-y-0.5"
               >
                 {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Analyze & Modernize</span>
                    </>
                  )}
               </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-2">
            {!result && !loading && (
               <div className="h-full flex flex-col items-center justify-center bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 p-12 text-center min-h-[400px] shadow-lg">
                   <div className="w-20 h-20 bg-gray-700 text-blue-400 rounded-full flex items-center justify-center mb-6 border border-gray-600">
                       <FileText size={40} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Waiting for Resume</h3>
                   <p className="text-gray-400 max-w-md">Upload your resume to receive a comprehensive review, modern formatting suggestions, and industry-specific upgrades.</p>
               </div>
            )}

            {loading && (
               <div className="h-full flex flex-col items-center justify-center bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 p-12 text-center min-h-[400px] shadow-lg">
                   <Loader2 size={48} className="animate-spin text-blue-500 mb-6" />
                   <h3 className="text-lg font-semibold text-white">Analyzing & Modernizing...</h3>
                   <p className="text-gray-400 mt-2">Checking grammar, ATS compatibility, and applying industry standards.</p>
               </div>
            )}

            {result && !loading && (
               <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-lg overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center sticky top-0 z-10">
                      <h2 className="font-bold text-white flex items-center">
                        <CheckCircle size={18} className="text-green-500 mr-2" />
                        Analysis Report
                      </h2>
                      <button onClick={downloadResult} className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-900/30 transition-colors">
                          <Download size={16} className="mr-1" />
                          Save Report
                      </button>
                  </div>
                  <div className="p-8 markdown-body overflow-y-auto max-h-[calc(100vh-200px)]">
                      <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;