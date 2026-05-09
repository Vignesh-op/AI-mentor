import React, { useState, useEffect } from 'react';
import { Briefcase, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateJobVacancies } from '../services/geminiService';
import { useLocation } from 'react-router-dom';

const JobVacancy: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    role: '',
    experience: 'Fresher'
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
        setFormData(prev => ({
            ...prev,
            role: location.state.role || '',
        }));
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) return;

    setLoading(true);
    setResult(null);
    
    try {
       const content = await generateJobVacancies(formData.role, formData.experience, '');
       setResult(content);
    } catch (e) {
      console.error(e);
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
      if(!result) return;
      const element = document.createElement("a");
      const file = new Blob([result], {type: 'text/markdown'});
      element.href = URL.createObjectURL(file);
      element.download = `${formData.role}-vacancies.md`;
      document.body.appendChild(element);
      element.click();
  };

  return (
    <div className="h-full overflow-y-auto bg-transparent p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Job Openings</h1>
            <p className="text-gray-300 bg-gray-800/60 backdrop-blur-sm inline-block rounded-lg px-2 py-1">Find realistic job listings and application links tailored to your profile.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="md:col-span-1">
            <div className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-black/30 border border-gray-700 sticky top-4">
              
              <div className="flex items-center space-x-2 text-indigo-400 mb-6">
                  <Briefcase size={24} />
                  <span className="font-semibold text-lg">Vacancy Search</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Target Role</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-400 bg-gray-700"
                    placeholder="e.g. Frontend Developer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Experience Level</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-700 text-white"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  >
                    <option value="Fresher">Student / Fresher</option>
                    <option value="Junior">Junior (1-3 years)</option>
                    <option value="Senior">Senior (4+ years)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.role}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-blue-900/50 hover:shadow-indigo-800/50 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Briefcase size={20} />
                      <span>Find Vacancies</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Result Section */}
          <div className="md:col-span-2">
             {loading && (
                 <div className="flex flex-col items-center justify-center h-64 bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 shadow-lg">
                     <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                     <p className="text-gray-400 animate-pulse">
                         Finding relevant job opportunities...
                     </p>
                 </div>
             )}

             {!loading && !result && (
                 <div className="flex flex-col items-center justify-center h-64 bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 text-center p-8 shadow-lg">
                     <div className="w-16 h-16 bg-gray-700 text-indigo-400 rounded-full flex items-center justify-center mb-4 border border-gray-600">
                        <Briefcase size={28} />
                     </div>
                     <h3 className="text-lg font-semibold text-white">
                         Ready to Apply?
                     </h3>
                     <p className="text-gray-400 mt-2">
                         Enter your target role and experience to find realistic job listings and application links.
                     </p>
                 </div>
             )}

             {result && !loading && (
                 <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
                     <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                         <h2 className="font-semibold text-white">
                             Job Listings
                         </h2>
                         <button onClick={downloadResult} className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium">
                             <Download size={16} className="mr-1" />
                             Save
                         </button>
                     </div>
                     <div className="p-8 markdown-body text-gray-200">
                         <ReactMarkdown 
                            components={{
                                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium" />,
                                img: ({node, ...props}) => (
                                    <img 
                                        {...props} 
                                        className="w-12 h-12 object-contain mb-3 rounded bg-white p-1 border border-gray-100 shadow-sm" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                )
                            }}
                         >
                            {result}
                         </ReactMarkdown>
                     </div>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobVacancy;