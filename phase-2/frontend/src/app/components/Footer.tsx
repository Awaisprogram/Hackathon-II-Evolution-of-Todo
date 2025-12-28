'use client';

import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border-t border-blue-500/20">
      {/* Optimized background gradient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-light animated-bg-light"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-light animated-bg-light"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              ToDoze
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Simplify your life with modern task management. Stay organized, boost productivity, and achieve your goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="w-9 h-9 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 TodoApp. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with <span className="text-blue-400">♥</span> for productivity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;