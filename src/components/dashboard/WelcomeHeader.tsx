
import { useAuth } from "@/contexts/AuthContext";

export function WelcomeHeader() {
  const { profile } = useAuth();
  const displayName = profile?.full_name || 'Student';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute top-20 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-white rounded-full translate-y-12"></div>
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              Welcome back, {displayName}! 
              <span className="inline-block ml-2 animate-bounce">🎓</span>
            </h2>
            <p className="text-blue-100 text-lg">
              Ready to continue your learning journey? You're doing amazing!
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
              <span className="text-sm font-medium">Keep up the great work!</span>
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
