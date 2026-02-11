import React from 'react';
import { GraduationCap, LogOut, UserCircle } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user?: User | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 mb-6">
      <div className="glass-panel rounded-2xl shadow-lg shadow-black/5 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md transform hover:rotate-6 transition-transform">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 tracking-tight">
              VTU Grade Genius
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 text-gray-700 bg-white/50 px-3 py-1.5 rounded-full border border-white shadow-sm">
                  <UserCircle className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-sm">{user.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="text-sm font-medium text-indigo-900 bg-indigo-50 px-4 py-2 rounded-full">
                Student Portal
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;