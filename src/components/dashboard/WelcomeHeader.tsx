
import { useAuth } from "@/contexts/AuthContext";

export function WelcomeHeader() {
  const { profile } = useAuth();
  const displayName = profile?.full_name || 'Student';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 md:p-8 lg:p-10 text-white shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 md:w-40 h-32 md:h-40 bg-white rounded-full -translate-x-16 md:-translate-x-20 -translate-y-16 md:-translate-y-20"></div>
        <div className="absolute top-16 md:top-20 right-0 w-24 md:w-32 h-24 md:h-32 bg-white rounded-full translate-x-12 md:translate-x-16 -translate-y-12 md:-translate-y-16"></div>
        <div className="absolute bottom-0 right-16 md:right-20 w-20 md:w-24 h-20 md:h-24 bg-white rounded-full translate-y-10 md:translate-y-12"></div>
      </div>
      
      {/* Content */}
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Welcome back, {displayName}! 
              <span className="inline-block ml-2 animate-bounce">🎓</span>
            </h2>
            <p className="text-blue-100 text-base md:text-lg lg:text-xl max-w-2xl">
              Ready to continue your learning journey? You're doing amazing! Keep pushing forward and achieve your goals.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <span className="text-sm font-medium">🚀 Keep up the momentum!</span>
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <span className="text-sm font-medium">📈 Progress is key</span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 animate-float">
              <span className="text-4xl">🚀</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-lg">✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
