import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, BookOpen, Search, FileText, Mic, 
  ArrowRight, CheckCircle, Users, Zap, Award 
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-transparent">
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6 drop-shadow-md">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI Mentor</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-300 mt-4">Your Intelligent AI Career Assistant</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-8 leading-relaxed">
            Master your career journey with real-time guidance, mock interviews, placement roadmaps, and AI-powered resume analysis.
          </p>
          <div className="flex justify-center">
            <Link
              to="/chat"
              className="px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 md:text-lg md:px-10 flex items-center shadow-lg shadow-blue-900/50 hover:shadow-indigo-800/50 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-900/50 backdrop-blur-md border-t border-gray-700/50 rounded-t-[3rem] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm text-blue-400 font-bold tracking-wide uppercase bg-blue-900/30 border border-blue-700/30 inline-block px-3 py-1 rounded-full backdrop-blur-sm">Capabilities</h2>
            <p className="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Everything You Need to Succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <MessageSquare className="text-blue-400" size={24} />, 
                title: "AI Mentor Chat", 
                desc: "Real-time Q&A for career advice and technical concepts.",
                bg: "bg-blue-900/30"
              },
              { 
                icon: <BookOpen className="text-indigo-400" size={24} />, 
                title: "Placement Preparation", 
                desc: "Structured roadmaps and study guides for specific roles.",
                bg: "bg-indigo-900/30"
              },
              { 
                icon: <Search className="text-violet-400" size={24} />, 
                title: "Job Openings Finder", 
                desc: "Find active vacancies with direct apply links.",
                bg: "bg-violet-900/30"
              },
              { 
                icon: <FileText className="text-blue-400" size={24} />, 
                title: "Resume Analyzer", 
                desc: "ATS analysis and modern formatting upgrades.",
                bg: "bg-blue-900/30"
              },
              { 
                icon: <Mic className="text-indigo-400" size={24} />, 
                title: "Mock Interviews", 
                desc: "Voice-enabled practice with instant feedback.",
                bg: "bg-indigo-900/30"
              },
              { 
                icon: <Zap className="text-violet-400" size={24} />, 
                title: "Skill Recommendations", 
                desc: "Identify gaps and learn industry-standard tools.",
                bg: "bg-violet-900/30"
              },
              { 
                icon: <CheckCircle className="text-blue-400" size={24} />, 
                title: "Interview Q&A", 
                desc: "Generate role-specific interview questions.",
                bg: "bg-blue-900/30"
              },
              { 
                icon: <Award className="text-indigo-400" size={24} />, 
                title: "Career Roadmap", 
                desc: "Step-by-step guides from fresher to pro.",
                bg: "bg-indigo-900/30"
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-gray-900/20 hover:bg-gray-750 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose & Target Audience */}
      <div className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Why Choose */}
            <div className="flex flex-col justify-center bg-gray-900/60 backdrop-blur-md p-8 rounded-3xl border border-gray-700/50 shadow-lg">
               <h2 className="text-3xl font-extrabold text-white mb-6">Why Choose AI Mentor?</h2>
               <div className="space-y-4">
                 {[
                   "Personalized learning tailored to your pace",
                   "Real-time career guidance available 24/7",
                   "Beginner-friendly explanations and interfaces",
                   "Powered by the latest Google Gemini AI models",
                   "Specifically designed for job seekers and students"
                 ].map((item, i) => (
                   <div key={i} className="flex items-start p-3 bg-gray-800 rounded-xl shadow-sm border border-gray-700">
                     <div className="flex-shrink-0 mt-0.5">
                       <CheckCircle className="h-5 w-5 text-blue-500" />
                     </div>
                     <p className="ml-3 text-base text-gray-300 font-medium">{item}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Who Is This For */}
            <div className="bg-gradient-to-br from-gray-800/90 to-blue-900/20 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-gray-700/50">
               <div className="flex items-center mb-6">
                  <div className="p-3 bg-indigo-900/40 rounded-xl text-indigo-400 mr-4 border border-indigo-500/20">
                    <Users size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Who Is This For?</h2>
               </div>
               <ul className="space-y-4">
                 {[
                   "College Students preparing for campus placements",
                   "Job Seekers looking for active opportunities",
                   "Professionals switching career paths",
                   "Anyone wanting to improve their resume and interview skills"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center text-gray-300 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm transition-transform hover:translate-x-1 hover:bg-gray-750">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></span>
                      {item}
                   </li>
                 ))}
               </ul>
            </div>

          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-gray-900/80 backdrop-blur-md py-12 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl font-bold text-white mb-6">Ready to start your journey?</h2>
              <Link
                to="/chat"
                className="inline-flex items-center px-8 py-3 rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all font-medium shadow-lg shadow-blue-900/50 hover:shadow-indigo-800/50 transform hover:-translate-y-0.5"
              >
                Start Your Journey <ArrowRight size={18} className="ml-2" />
              </Link>
          </div>
      </div>
    </div>
  );
};

export default Home;