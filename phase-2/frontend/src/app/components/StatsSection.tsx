import React from 'react';
import { Users, CheckCircle, TrendingUp, Clock } from 'lucide-react';

function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      value: '50,000+',
      label: 'Tasks Completed',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: TrendingUp,
      value: '85%',
      label: 'Productivity Boost',
      color: 'from-blue-500 to-sky-500'
    },
    {
      icon: Clock,
      value: '2min',
      label: 'Avg. Setup Time',
      color: 'from-sky-500 to-cyan-500'
    }
  ];

  return (
    <div className='relative overflow-hidden py-20'>
      {/* Optimized animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-optimized animated-bg"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-light animated-bg-light"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join our growing community of productive individuals and teams
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:scale-105 text-center"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsSection
