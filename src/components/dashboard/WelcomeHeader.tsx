
export function WelcomeHeader() {
  return (
    <div className="gradient-primary rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome back, Alex! 🎓</h2>
          <p className="text-white/90">Ready to continue your learning journey? You're doing great!</p>
        </div>
        <div className="hidden md:block animate-float">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
}
