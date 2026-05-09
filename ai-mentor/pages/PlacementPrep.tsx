import React, { useState } from 'react';
import { BookOpen, Search, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generatePlacementPrep } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const PlacementPrep: React.FC = () => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    experience: 'Fresher'
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role || !formData.company) return;

    setLoading(true);
    setResult(null);
    
    try {
       const content = await generatePlacementPrep(formData.company, formData.role, formData.experience);
       setResult(content);
    } catch (e) {
      console.error(e);
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFindJobs = () => {
    navigate('/job-vacancy', { state: { role: formData.role, company: formData.company } });
  };

  const downloadResult = () => {
      if(!result) return;
      const element = document.createElement("a");
      const file = new Blob([result], {type: 'text/markdown'});
      element.href = URL.createObjectURL(file);
      element.download = `${formData.company}-${formData.role}-prep.md`;
      document.body.appendChild(element);
      element.click();
  };

  return (
    <div className="h-full overflow-y-auto bg-transparent p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Placement Preparation</h1>
            <p className="text-gray-300 bg-gray-800/60 backdrop-blur-sm inline-block rounded-lg px-2 py-1">Get a comprehensive study guide, interview questions, and roadmaps for your dream company.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="md:col-span-1">
            <div className="bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-black/30 border border-gray-700 sticky top-4">
              
              <div className="flex items-center space-x-2 text-indigo-400 mb-6">
                  <BookOpen size={24} />
                  <span className="font-semibold text-lg">Study Guide</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Target Company</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-700 text-white placeholder-gray-400"
                      placeholder="e.g. Google, Amazon"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-700 text-white placeholder-gray-400"
                    placeholder="e.g. SDE 1, Data Scientist"
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
                  disabled={loading || !formData.role || !formData.company}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-blue-900/50 hover:shadow-indigo-800/50 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} />
                      <span>Generate Guide</span>
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
                         Gathering latest interview patterns...
                     </p>
                 </div>
             )}

             {!loading && !result && (
                 <div className="flex flex-col items-center justify-center h-64 bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700 text-center p-8 shadow-lg">
                     <div className="w-16 h-16 bg-gray-700 text-blue-400 rounded-full flex items-center justify-center mb-4 border border-gray-600">
                         <BookOpen size={28} />
                     </div>
                     <h3 className="text-lg font-semibold text-white">
                         Ready to Prepare?
                     </h3>
                     <p className="text-gray-400 mt-2">
                         Enter a target company and role to generate a comprehensive study plan and roadmap.
                     </p>
                 </div>
             )}

             {result && !loading && (
                 <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
                     <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                         <h2 className="font-semibold text-white">
                             Preparation Guide
                         </h2>
                         <div className="flex space-x-2">
                            <button onClick={handleFindJobs} className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium border border-blue-900/50 px-3 py-1 rounded-md hover:bg-blue-900/30 transition-colors">
                                <Search size={16} className="mr-1" />
                                Find Jobs
                            </button>
                            <button onClick={downloadResult} className="text-gray-400 hover:text-gray-200 flex items-center text-sm font-medium border border-gray-700 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors">
                                <Download size={16} className="mr-1" />
                                Save
                            </button>
                         </div>
                     </div>
                     <div className="p-8 markdown-body">
                         <ReactMarkdown 
                            components={{
                                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium" />
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

export default PlacementPrep;