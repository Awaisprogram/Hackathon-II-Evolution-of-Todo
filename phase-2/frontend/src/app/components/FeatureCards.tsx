import React from 'react'
import { CheckCircle, Zap, Target } from 'lucide-react';

function FeatureCards() {
  return (
    <div className='relative overflow-hidden'> 
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Feature Cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="group p-6 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Easy Organization</h3>
            <p className="text-gray-400 text-sm">
              Keep all your tasks organized in one beautiful, intuitive interface
            </p>
          </div>

          <div className="group p-6 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-500/20 rounded-2xl backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Boost Productivity</h3>
            <p className="text-gray-400 text-sm">
              Get more done with smart features designed to enhance your workflow
            </p>
          </div>

          <div className="group p-6 bg-gradient-to-br from-blue-900/20 to-sky-800/10 border border-sky-500/20 rounded-2xl backdrop-blur-sm hover:border-sky-500/40 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500/30 transition-colors">
              <Target className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Achieve Goals</h3>
            <p className="text-gray-400 text-sm">
              Track your progress and accomplish your goals one task at a time
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureCards