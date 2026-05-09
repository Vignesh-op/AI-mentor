import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Mic, BookOpen, FileText, Briefcase, Award } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { to: "/chat", icon: <MessageSquare size={20} />, label: "Mentor Chat" },
    { to: "/mock-interview", icon: <Mic size={20} />, label: "Mock Interview" },
    { to: "/placement-prep", icon: <BookOpen size={20} />, label: "Placement Prep" },
    { to: "/job-vacancy", icon: <Briefcase size={20} />, label: "Job Openings" },
    { to: "/resume-analyzer", icon: <FileText size={20} />, label: "Resume Analyzer" },
    { to: "/career-roadmap", icon: <Award size={20} />, label: "Career Roadmap" },
  ];

  return (
    // Main container with dark glassmorphism effect
    <div className="flex flex-col h-screen bg-gray-900/85 backdrop-blur-sm font-sans text-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-gray-900/70 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 flex-shrink-0 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 mr-4 md:mr-6">
              <NavLink to="/" className="flex items-center group">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-2.5 shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform">
                  AI
                </div>
                <span className="text-xl font-bold tracking-tight text-white hidden sm:block group-hover:text-blue-400 transition-colors">Mentor</span>
              </NavLink>
            </div>

            {/* Navigation Icons */}
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide flex-1 justify-center md:justify-start">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-center px-3 py-2 rounded-lg transition-all whitespace-nowrap group relative ${
                      isActive
                        ? 'bg-blue-900/40 text-blue-400 font-medium border border-blue-800/30'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-100'
                    }`
                  }
                  title={item.label}
                >
                  {({ isActive }) => (
                    <>
                       {/* Icon */}
                       <span className={`transition-colors duration-200 ${isActive ? 'text-blue-400 drop-shadow-sm' : 'group-hover:text-gray-200'}`}>
                         {item.icon}
                       </span>
                       
                       {/* Label - visible on medium screens and up */}
                       <span className={`ml-2 text-sm hidden md:block ${isActive ? 'text-blue-300' : 'text-gray-400 group-hover:text-gray-200'}`}>
                         {item.label}
                       </span>
                       
                       {/* Active Indicator Dot */}
                       {isActive && (
                         <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full md:hidden"></span>
                       )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative w-full max-w-7xl mx-auto flex flex-col">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800 py-4 text-center text-xs text-gray-500 flex-shrink-0 z-40">
        &copy; 2025 AI Mentor All rights reserved
      </footer>
    </div>
  );
};

export default Layout;