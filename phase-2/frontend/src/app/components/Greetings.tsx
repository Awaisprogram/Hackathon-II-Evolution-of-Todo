import {
  Sparkles
} from 'lucide-react';

const formatFullDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

function Greetings() {
  return (
    <>
      {/* Welcome */}
      <div className="my-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              {getGreeting()}, User 👋
            </h1>
          </div>
          <p className="text-gray-400 text-lg">{formatFullDate()}</p>
          <p className="text-gray-500 mt-1">Stay focused and accomplish your goals today!</p>
        </div> 
    </>
  )
}

export default Greetings
