import React from 'react';
import { Plus, CheckSquare, Trophy } from 'lucide-react';

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Plus,
      title: 'Create Tasks',
      description: 'Simply add your tasks with titles, priorities, and due dates. Our intuitive interface makes it effortless.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      icon: CheckSquare,
      title: 'Organize & Track',
      description: 'Keep track of your progress with visual indicators, categories, and smart filtering options.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      number: '03',
      icon: Trophy,
      title: 'Achieve Goals',
      description: 'Complete tasks, build streaks, and celebrate your achievements with our gamification features.',
      color: 'from-blue-500 to-sky-500'
    }
  ];

  return (
    <div className='relative overflow-hidden py-20'>
      {/* Optimized animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-optimized animated-bg"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-optimized animated-bg"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-light animated-bg-light"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started in just three simple steps and transform your productivity today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative cursor-pointer"
            >
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0"></div>
              )}
              
              <div className="relative p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:scale-105 text-center z-10">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{step.number}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
